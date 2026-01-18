/**
 * Vercel AI SDK adapter for Exa tools.
 * Wraps the core SDK-agnostic implementations as AI SDK tools.
 */

import { tool } from "ai";
import { z } from "zod";
import { webSearch } from "../core/webSearch.js";
import { webContents } from "../core/webContents.js";
import type {
  ExaWebSearchConfig,
  ExaContentsConfig,
  ExaApiResponse,
  ExaContentsResponse,
} from "../types.js";

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
 * Creates a web search tool powered by Exa for use with Vercel AI SDK.
 *
 * @param config - Configuration options for the Exa search
 * @returns A tool that can be used with AI SDK's generateText, streamText, or agents
 *
 * @example Basic usage with environment variable
 * ```ts
 * import { generateText } from "ai";
 * import { exaWebSearch } from "@ai-registry/exa";
 * import { openai } from "@ai-sdk/openai";
 *
 * // Set EXA_API_KEY in your environment
 * const { text } = await generateText({
 *   model: openai("gpt-4o-mini"),
 *   prompt: "What are the latest developments in AI?",
 *   tools: {
 *     webSearch: exaWebSearch(),
 *   },
 * });
 * ```
 *
 * @example With custom configuration
 * ```ts
 * import { exaWebSearch } from "@ai-registry/exa";
 *
 * const webSearch = exaWebSearch({
 *   apiKey: "your-exa-api-key",
 *   numResults: 5,
 *   type: "neural",
 *   category: "research paper",
 *   contents: {
 *     text: { maxCharacters: 5000 },
 *     highlights: true,
 *     summary: true,
 *   },
 * });
 * ```
 *
 * @example Domain filtering
 * ```ts
 * const technicalSearch = exaWebSearch({
 *   includeDomains: ["github.com", "stackoverflow.com", "docs.python.org"],
 *   excludeDomains: ["pinterest.com"],
 *   type: "keyword",
 * });
 * ```
 */
export function exaWebSearch(config: ExaWebSearchConfig = {}) {
  const { toolDescription, ...searchOptions } = config;

  return tool({
    description: toolDescription ?? DEFAULT_SEARCH_DESCRIPTION,
    inputSchema: webSearchInputSchema,
    execute: async ({ query }): Promise<ExaApiResponse> => {
      return webSearch({ query }, searchOptions);
    },
  });
}

/**
 * Creates a web contents tool powered by Exa for use with Vercel AI SDK.
 *
 * @param config - Configuration options for fetching contents
 * @returns A tool that can be used with AI SDK's generateText, streamText, or agents
 *
 * @example Basic usage
 * ```ts
 * import { generateText } from "ai";
 * import { exaWebContents } from "@ai-registry/exa";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai("gpt-4o-mini"),
 *   prompt: "Summarize this article: https://example.com/article",
 *   tools: {
 *     webContents: exaWebContents(),
 *   },
 * });
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const webContents = exaWebContents({
 *   apiKey: "your-exa-api-key",
 *   contents: {
 *     text: { maxCharacters: 10000 },
 *     summary: true,
 *     livecrawl: "always",
 *   },
 * });
 * ```
 */
export function exaWebContents(config: ExaContentsConfig = {}) {
  const { toolDescription, ...contentsOptions } = config;

  return tool({
    description: toolDescription ?? DEFAULT_CONTENTS_DESCRIPTION,
    inputSchema: contentsInputSchema,
    execute: async ({ urls }): Promise<ExaContentsResponse> => {
      return webContents({ urls }, contentsOptions);
    },
  });
}

// Re-export config types for convenience
export type { ExaWebSearchConfig, ExaContentsConfig };
