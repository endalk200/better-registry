import type { LanguageModel, ToolSet } from "ai";
import type { ExaWebSearchConfig } from "@ai-registry/exa-websearch";

/**
 * Configuration for the retrieval agent's web search capabilities
 */
export interface RetrievalWebSearchConfig extends Omit<
  ExaWebSearchConfig,
  "toolDescription"
> {
  /**
   * Whether to enable web search (default: true)
   */
  enabled?: boolean;
}

/**
 * Output format for the retrieval agent
 */
export type RetrievalOutputFormat = "text" | "markdown" | "structured";

/**
 * Structured output schema for retrieval results
 */
export interface RetrievalStructuredOutput {
  /** The main answer or summary */
  answer: string;
  /** Key points extracted from the search */
  keyPoints: string[];
  /** Sources used for the answer */
  sources: Array<{
    title: string;
    url: string;
    relevance?: string;
  }>;
  /** Confidence level in the answer */
  confidence: "high" | "medium" | "low";
  /** Any caveats or limitations */
  caveats?: string[];
}

/**
 * Stop condition configuration
 */
export interface StopConditionConfig {
  /**
   * Maximum number of steps (default: 10)
   */
  maxSteps?: number;
}

/**
 * Tool choice configuration
 */
export type ToolChoiceConfig =
  | "auto"
  | "none"
  | "required"
  | { type: "tool"; toolName: string };

/**
 * Main configuration for the retrieval agent
 */
export interface RetrievalAgentConfig {
  /**
   * The language model to use for the agent.
   * Must be a valid AI SDK language model.
   *
   * @example
   * ```ts
   * import { openai } from "@ai-sdk/openai";
   * model: openai("gpt-4o")
   * ```
   */
  model: LanguageModel;

  /**
   * Custom system instructions for the agent.
   * These will be appended to the default retrieval instructions.
   */
  instructions?: string;

  /**
   * Whether to use the default retrieval-focused instructions.
   * Set to false to use only your custom instructions.
   * Default: true
   */
  useDefaultInstructions?: boolean;

  /**
   * Web search configuration
   */
  webSearch?: RetrievalWebSearchConfig;

  /**
   * Additional tools to provide to the agent.
   * These will be merged with the built-in web search tool.
   *
   * @example
   * ```ts
   * import { tool } from "ai";
   * import { z } from "zod";
   *
   * additionalTools: {
   *   calculator: tool({
   *     description: "Perform calculations",
   *     parameters: z.object({ expression: z.string() }),
   *     execute: async ({ expression }) => ({ result: eval(expression) }),
   *   }),
   * }
   * ```
   */
  additionalTools?: ToolSet;

  /**
   * Stop condition configuration
   */
  stopCondition?: StopConditionConfig;

  /**
   * Tool choice configuration
   */
  toolChoice?: ToolChoiceConfig;

  /**
   * Output format preference
   * - "text": Plain text response
   * - "markdown": Markdown formatted with citations
   * - "structured": Structured JSON output
   */
  outputFormat?: RetrievalOutputFormat;

  /**
   * Temperature for the model (0-2)
   * Lower values = more focused/deterministic
   * Higher values = more creative/varied
   * Default: 0.3 (focused for retrieval tasks)
   */
  temperature?: number;

  /**
   * Maximum tokens in the response
   */
  maxOutputTokens?: number;
}

/**
 * Options for the generate method
 */
export interface RetrievalGenerateOptions {
  /**
   * The query or prompt to research
   */
  prompt: string;

  /**
   * Optional context to provide to the agent
   */
  context?: string;

  /**
   * Override the output format for this request
   */
  outputFormat?: RetrievalOutputFormat;
}

/**
 * Options for the stream method
 */
export interface RetrievalStreamOptions extends RetrievalGenerateOptions {
  /**
   * Callback for each chunk of text
   */
  onChunk?: (chunk: string) => void;
}
