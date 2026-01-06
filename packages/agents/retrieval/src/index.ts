import { ToolLoopAgent, Output, stepCountIs } from "ai";
import { z } from "zod";
import {
  exaWebSearch,
  type ExaWebSearchConfig,
} from "@ai-registry/exa-websearch";
import type {
  RetrievalAgentConfig,
  RetrievalStructuredOutput,
} from "./types.js";

/**
 * Default instructions for the retrieval agent
 */
const DEFAULT_INSTRUCTIONS = `You are an expert research assistant with access to web search capabilities.

Your approach to information retrieval:
1. **Understand the Query**: Carefully analyze what information is being requested
2. **Search Strategically**: Use specific, targeted search queries to find relevant information
3. **Verify Information**: Cross-reference multiple sources when possible
4. **Synthesize Findings**: Combine information from multiple sources into a coherent response
5. **Cite Sources**: Always provide attribution for information you present

Guidelines:
- Be thorough but concise - prioritize quality over quantity
- If information is uncertain or conflicting, acknowledge this
- Prefer recent sources for time-sensitive topics
- For technical topics, prioritize authoritative sources (official docs, academic papers)
- If you cannot find reliable information, say so rather than speculating

When presenting information:
- Lead with the most relevant findings
- Use clear, organized formatting
- Include source URLs for verification
- Note publication dates when relevant`;

/**
 * Structured output schema for retrieval results
 */
export const structuredOutputSchema = z.object({
  answer: z.string().describe("The main answer or summary"),
  keyPoints: z
    .array(z.string())
    .describe("Key points extracted from the search"),
  sources: z
    .array(
      z.object({
        title: z.string().describe("Title of the source"),
        url: z.string().describe("URL of the source"),
        relevance: z
          .string()
          .optional()
          .describe("Why this source is relevant"),
      }),
    )
    .describe("Sources used for the answer"),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe("Confidence level in the answer"),
  caveats: z
    .array(z.string())
    .optional()
    .describe("Any caveats or limitations"),
});

/**
 * Builds the web search tool configuration
 */
function buildWebSearchConfig(
  webSearchConfig: RetrievalAgentConfig["webSearch"],
): ExaWebSearchConfig {
  if (!webSearchConfig) return {};
  // Create a copy without the 'enabled' property for exaWebSearch
  const { enabled: _, ...exaConfig } = webSearchConfig;
  return exaConfig;
}

/**
 * Builds the system instructions for the retrieval agent
 */
function buildInstructions(config: RetrievalAgentConfig): string {
  const {
    instructions,
    useDefaultInstructions = true,
    outputFormat = "markdown",
  } = config;

  let systemInstructions = "";
  if (useDefaultInstructions) {
    systemInstructions = DEFAULT_INSTRUCTIONS;
    if (instructions) {
      systemInstructions += `\n\n## Additional Instructions\n${instructions}`;
    }
  } else {
    systemInstructions = instructions ?? "";
  }

  // Add output format instructions
  if (outputFormat === "markdown") {
    systemInstructions += `\n\n## Output Format
Format your response in Markdown with:
- Clear headings for different sections
- Bullet points for key findings
- Inline links for citations [Source Title](url)
- Code blocks for any technical content`;
  } else if (outputFormat === "structured") {
    systemInstructions += `\n\n## Output Format
Provide a structured response with:
- A clear answer/summary
- Key points as a list
- Sources with titles and URLs
- Your confidence level (high/medium/low)
- Any caveats or limitations`;
  }

  return systemInstructions;
}

/**
 * Type alias for structured output agent.
 * Uses generic ToolLoopAgent with structured output type.
 */
export type StructuredRetrievalAgent = ToolLoopAgent<RetrievalStructuredOutput>;

/**
 * Type alias for text output agent.
 * Uses generic ToolLoopAgent with no structured output.
 */
export type TextRetrievalAgent = ToolLoopAgent<never>;

/**
 * Config type for structured output
 */
type StructuredConfig = RetrievalAgentConfig & { outputFormat: "structured" };

/**
 * Config type for text/markdown output
 */
type TextConfig = RetrievalAgentConfig & {
  outputFormat?: "text" | "markdown";
};

/**
 * Creates a configurable retrieval agent with web search capabilities.
 *
 * The retrieval agent is designed for information retrieval tasks, combining
 * web search capabilities with LLM-powered synthesis and analysis.
 *
 * @param config - Configuration options for the retrieval agent
 * @returns A configured ToolLoopAgent instance
 *
 * @example Basic usage
 * ```ts
 * import { createRetrievalAgent } from "@ai-registry/retrieval-agent";
 * import { openai } from "@ai-sdk/openai";
 *
 * const agent = createRetrievalAgent({
 *   model: openai("gpt-4o"),
 * });
 *
 * const result = await agent.generate({
 *   prompt: "What are the latest developments in quantum computing?",
 * });
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const agent = createRetrievalAgent({
 *   model: openai("gpt-4o"),
 *   instructions: "Focus on academic research and peer-reviewed sources.",
 *   webSearch: {
 *     numResults: 15,
 *     category: "research paper",
 *     includeDomains: ["arxiv.org", "nature.com"],
 *   },
 *   outputFormat: "structured",
 *   temperature: 0.2,
 * });
 * ```
 *
 * @example With additional tools
 * ```ts
 * const agent = createRetrievalAgent({
 *   model: openai("gpt-4o"),
 *   additionalTools: {
 *     calculator: tool({
 *       description: "Perform calculations",
 *       parameters: z.object({ expression: z.string() }),
 *       execute: async ({ expression }) => eval(expression),
 *     }),
 *   },
 * });
 * ```
 */
export function createRetrievalAgent(
  config: StructuredConfig,
): StructuredRetrievalAgent;
export function createRetrievalAgent(config: TextConfig): TextRetrievalAgent;
export function createRetrievalAgent(
  config: RetrievalAgentConfig,
): StructuredRetrievalAgent | TextRetrievalAgent;
export function createRetrievalAgent(
  config: RetrievalAgentConfig,
): StructuredRetrievalAgent | TextRetrievalAgent {
  const {
    model,
    webSearch: webSearchConfig = {},
    additionalTools = {},
    stopCondition = {},
    toolChoice = "auto",
    outputFormat = "markdown",
    temperature = 0.3,
    maxOutputTokens,
  } = config;

  const systemInstructions = buildInstructions(config);
  const webSearchEnabled = webSearchConfig?.enabled !== false;
  const exaConfig = buildWebSearchConfig(webSearchConfig);

  // Build tools object
  const webSearchTool = exaWebSearch(exaConfig);
  const tools = webSearchEnabled
    ? { webSearch: webSearchTool, ...additionalTools }
    : additionalTools;

  // Common agent settings
  const commonSettings = {
    model,
    instructions: systemInstructions,
    tools,
    toolChoice: toolChoice as "auto" | "none" | "required",
    stopWhen: stepCountIs(stopCondition.maxSteps ?? 10),
    temperature,
    maxOutputTokens,
  };

  // Create agent based on output format
  if (outputFormat === "structured") {
    // For structured output, we use Output.object
    // The type assertion is needed because ToolLoopAgent's generic constraints
    // are stricter than what we can express with dynamic tool composition
    return new ToolLoopAgent({
      ...commonSettings,
      output: Output.object({
        schema: structuredOutputSchema,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any) as StructuredRetrievalAgent;
  }

  // For text/markdown output, we don't specify an output schema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ToolLoopAgent(commonSettings as any) as TextRetrievalAgent;
}

/**
 * Pre-configured retrieval agent factory with common configurations
 */
export const RetrievalAgentPresets = {
  /**
   * Creates a general-purpose research agent
   */
  research: (
    model: RetrievalAgentConfig["model"],
    overrides?: Partial<Omit<RetrievalAgentConfig, "model" | "outputFormat">>,
  ): TextRetrievalAgent =>
    createRetrievalAgent({
      model,
      instructions:
        "Focus on providing comprehensive, well-researched answers with multiple sources.",
      webSearch: {
        numResults: 10,
        contents: {
          text: { maxCharacters: 5000 },
          highlights: true,
          summary: true,
        },
        ...overrides?.webSearch,
      },
      temperature: 0.3,
      ...overrides,
      outputFormat: "markdown",
    }),

  /**
   * Creates an agent focused on academic/scientific research
   */
  academic: (
    model: RetrievalAgentConfig["model"],
    overrides?: Partial<Omit<RetrievalAgentConfig, "model" | "outputFormat">>,
  ): StructuredRetrievalAgent =>
    createRetrievalAgent({
      model,
      instructions: `Focus on peer-reviewed sources, academic papers, and authoritative scientific publications.
        Prioritize recency and citation count when evaluating sources.
        Always note the methodology and limitations of studies you cite.`,
      webSearch: {
        category: "research paper",
        numResults: 15,
        type: "neural",
        includeDomains: [
          "arxiv.org",
          "scholar.google.com",
          "pubmed.ncbi.nlm.nih.gov",
          "nature.com",
          "science.org",
          "ieee.org",
        ],
        contents: {
          text: { maxCharacters: 8000 },
          highlights: { numSentences: 5, highlightsPerUrl: 3 },
          summary: true,
        },
        ...overrides?.webSearch,
      },
      temperature: 0.2,
      ...overrides,
      outputFormat: "structured",
    }),

  /**
   * Creates an agent focused on news and current events
   */
  news: (
    model: RetrievalAgentConfig["model"],
    overrides?: Partial<Omit<RetrievalAgentConfig, "model" | "outputFormat">>,
  ): TextRetrievalAgent =>
    createRetrievalAgent({
      model,
      instructions: `Focus on recent news from reputable sources.
        Cross-reference multiple news outlets to verify facts.
        Note publication dates and distinguish between news and opinion pieces.`,
      webSearch: {
        category: "news",
        numResults: 12,
        type: "auto",
        // Get news from last 7 days by default
        startPublishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        contents: {
          text: { maxCharacters: 3000 },
          highlights: { numSentences: 2, highlightsPerUrl: 4 },
        },
        ...overrides?.webSearch,
      },
      temperature: 0.3,
      ...overrides,
      stopCondition: { maxSteps: 5 },
      outputFormat: "markdown",
    }),

  /**
   * Creates an agent focused on technical documentation
   */
  technical: (
    model: RetrievalAgentConfig["model"],
    overrides?: Partial<Omit<RetrievalAgentConfig, "model" | "outputFormat">>,
  ): TextRetrievalAgent =>
    createRetrievalAgent({
      model,
      instructions: `Focus on official documentation, technical specifications, and authoritative technical sources.
        Include code examples when relevant.
        Note version numbers and compatibility information.`,
      webSearch: {
        type: "keyword",
        numResults: 10,
        includeDomains: [
          "docs.python.org",
          "developer.mozilla.org",
          "docs.microsoft.com",
          "docs.aws.amazon.com",
          "cloud.google.com/docs",
          "github.com",
          "stackoverflow.com",
        ],
        contents: {
          text: { maxCharacters: 6000 },
          livecrawl: "always",
        },
        ...overrides?.webSearch,
      },
      temperature: 0.1,
      ...overrides,
      outputFormat: "markdown",
    }),
};

// Re-export types
export type {
  RetrievalAgentConfig,
  RetrievalGenerateOptions,
  RetrievalStreamOptions,
  RetrievalStructuredOutput,
  RetrievalWebSearchConfig,
  RetrievalOutputFormat,
  StopConditionConfig,
  ToolChoiceConfig,
} from "./types.js";

// Re-export ai SDK utilities for consumers
export { Output, ToolLoopAgent, tool, stepCountIs } from "ai";
export type { ToolSet, ToolLoopAgentSettings } from "ai";

// Re-export exa-websearch for convenience
export { exaWebSearch } from "@ai-registry/exa-websearch";
export type {
  ExaWebSearchConfig,
  ExaApiResponse,
  ExaSearchResult,
} from "@ai-registry/exa-websearch";
