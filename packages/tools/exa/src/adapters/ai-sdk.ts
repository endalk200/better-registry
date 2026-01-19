/**
 * Vercel AI SDK adapter for Exa tools.
 * Wraps the core SDK-agnostic implementations as AI SDK tools.
 */

import { tool } from "ai";
import { z } from "zod";
import { webSearch, type WebSearchOptions } from "../core/webSearch.js";
import { webContents, type WebContentsOptions } from "../core/webContents.js";
import type { ExaApiResponse, ExaContentsResponse } from "../types.js";

const DEFAULT_SEARCH_DESCRIPTION =
  "Search the web for current information, documentation, news, articles, and research. " +
  "Use this when you need up-to-date information, facts from the internet, or to find specific content. " +
  "Performs real-time web searches with optional content scraping.";

const DEFAULT_CONTENTS_DESCRIPTION =
  "Fetch full page contents, summaries, and metadata for a list of URLs using Exa. " +
  "Use this when you already have URLs and want to retrieve their text or summaries.";

const webSearchInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(500)
    .describe(
      "The web search query - be specific and clear about what you're looking for",
    ),
});

const contentsInputSchema = z.object({
  urls: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one URL is required")
    .max(50, "Maximum 50 URLs allowed")
    .describe("List of URLs to fetch content for"),
});

/**
 * Tool-specific options for adapter factory functions.
 */
export interface ExaToolOptions {
  /** Custom tool description for the LLM */
  description?: string;
}

/**
 * Creates a web search tool powered by Exa for use with Vercel AI SDK.
 *
 * @param config - Configuration options for the Exa search (core options only)
 * @param toolOptions - Tool-specific options like custom description
 * @returns A tool that can be used with AI SDK's generateText, streamText, or agents
 *
 * @example Basic usage with environment variable
 * ```ts
 * import { generateText } from "ai";
 * import { createExaWebSearchTool } from "@ai-registry/exa";
 * import { openai } from "@ai-sdk/openai";
 *
 * // Set EXA_API_KEY in your environment
 * const { text } = await generateText({
 *   model: openai("gpt-4o-mini"),
 *   prompt: "What are the latest developments in AI?",
 *   tools: {
 *     webSearch: createExaWebSearchTool(),
 *   },
 * });
 * ```
 *
 * @example With custom configuration
 * ```ts
 * import { createExaWebSearchTool } from "@ai-registry/exa";
 *
 * const webSearch = createExaWebSearchTool(
 *   {
 *     apiKey: "your-exa-api-key",
 *     numResults: 5,
 *     type: "neural",
 *     category: "research paper",
 *     contents: {
 *       text: { maxCharacters: 5000 },
 *       highlights: true,
 *       summary: true,
 *     },
 *   },
 *   { description: "Search academic papers and research" }
 * );
 * ```
 *
 * @example Domain filtering
 * ```ts
 * const technicalSearch = createExaWebSearchTool({
 *   includeDomains: ["github.com", "stackoverflow.com", "docs.python.org"],
 *   excludeDomains: ["pinterest.com"],
 *   type: "keyword",
 * });
 * ```
 */
export function createExaWebSearchTool(
  config: WebSearchOptions = {},
  toolOptions: ExaToolOptions = {},
) {
  return tool({
    description: toolOptions.description ?? DEFAULT_SEARCH_DESCRIPTION,
    inputSchema: webSearchInputSchema,
    execute: async ({ query }): Promise<ExaApiResponse> => {
      return webSearch({ query }, config);
    },
  });
}

/**
 * Creates a web contents tool powered by Exa for use with Vercel AI SDK.
 *
 * @param config - Configuration options for fetching contents (core options only)
 * @param toolOptions - Tool-specific options like custom description
 * @returns A tool that can be used with AI SDK's generateText, streamText, or agents
 *
 * @example Basic usage
 * ```ts
 * import { generateText } from "ai";
 * import { createExaWebContentsTool } from "@ai-registry/exa";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai("gpt-4o-mini"),
 *   prompt: "Summarize this article: https://example.com/article",
 *   tools: {
 *     webContents: createExaWebContentsTool(),
 *   },
 * });
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const webContents = createExaWebContentsTool(
 *   {
 *     apiKey: "your-exa-api-key",
 *     contents: {
 *       text: { maxCharacters: 10000 },
 *       summary: true,
 *       livecrawl: "always",
 *     },
 *   },
 *   { description: "Fetch and analyze web page content" }
 * );
 * ```
 */
export function createExaWebContentsTool(
  config: WebContentsOptions = {},
  toolOptions: ExaToolOptions = {},
) {
  return tool({
    description: toolOptions.description ?? DEFAULT_CONTENTS_DESCRIPTION,
    inputSchema: contentsInputSchema,
    execute: async ({ urls }): Promise<ExaContentsResponse> => {
      return webContents({ urls }, config);
    },
  });
}

// Re-export config types for convenience
export type { WebSearchOptions, WebContentsOptions };
