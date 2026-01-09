import { tool } from "ai";
import { Effect } from "effect";
import { z } from "zod";
import type { ExaWebSearchConfig, ExaApiResponse } from "../types.js";
import {
  MissingApiKeyError,
  ExaResponseValidationError,
} from "../utils/errors.js";
import { ExaApiResponseSchema } from "../schemas/searchResponseSchema.js";
import { postJson } from "../utils/exaHttp.js";
import { exaWebContents } from "./webContents.js";

/**
 * Package version for API tracking
 */
const PACKAGE_VERSION = "0.1.0";

/**
 * Default tool description
 */
const DEFAULT_DESCRIPTION =
  "Search the web for current information, documentation, news, articles, and research. " +
  "Use this when you need up-to-date information, facts from the internet, or to find specific content. " +
  "Performs real-time web searches with optional content scraping.";

/**
 * Input schema for the web search tool
 */
const webSearchInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(500)
    .describe(
      "The web search query - be specific and clear about what you're looking for",
    ),
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
  const { apiKey, toolDescription, timeoutMs, ...searchOptions } = config;

  // Get API key from config or environment
  const resolvedApiKey =
    apiKey ??
    (typeof process !== "undefined" ? process.env?.EXA_API_KEY : undefined);

  return tool({
    description: toolDescription ?? DEFAULT_DESCRIPTION,
    inputSchema: webSearchInputSchema,
    execute: async ({ query }): Promise<ExaApiResponse> => {
      if (!resolvedApiKey) {
        throw new MissingApiKeyError(
          "EXA_API_KEY is required. Set it in environment variables or pass it in config.",
        );
      }

      // Build the request body matching Exa API structure
      const requestBody: Record<string, unknown> = {
        query,
        type: searchOptions.type ?? "auto",
        numResults: searchOptions.numResults ?? 10,
      };

      if (searchOptions.additionalQueries?.length) {
        requestBody.additionalQueries = searchOptions.additionalQueries;
      }

      if (searchOptions.moderation !== undefined) {
        requestBody.moderation = searchOptions.moderation;
      }

      if (searchOptions.context !== undefined) {
        requestBody.context = searchOptions.context;
      }

      // Add optional search parameters
      if (searchOptions.category) {
        requestBody.category = searchOptions.category;
      }
      if (searchOptions.userLocation) {
        requestBody.userLocation = searchOptions.userLocation;
      }
      if (
        searchOptions.includeDomains &&
        searchOptions.includeDomains.length > 0
      ) {
        requestBody.includeDomains = searchOptions.includeDomains;
      }
      if (
        searchOptions.excludeDomains &&
        searchOptions.excludeDomains.length > 0
      ) {
        requestBody.excludeDomains = searchOptions.excludeDomains;
      }
      if (searchOptions.startCrawlDate) {
        requestBody.startCrawlDate = searchOptions.startCrawlDate;
      }
      if (searchOptions.endCrawlDate) {
        requestBody.endCrawlDate = searchOptions.endCrawlDate;
      }
      if (searchOptions.startPublishedDate) {
        requestBody.startPublishedDate = searchOptions.startPublishedDate;
      }
      if (searchOptions.endPublishedDate) {
        requestBody.endPublishedDate = searchOptions.endPublishedDate;
      }
      if (searchOptions.includeText && searchOptions.includeText.length > 0) {
        requestBody.includeText = searchOptions.includeText;
      }
      if (searchOptions.excludeText && searchOptions.excludeText.length > 0) {
        requestBody.excludeText = searchOptions.excludeText;
      }

      // Build contents configuration with defaults
      const contents = searchOptions.contents ?? {};
      const contentsConfig: Record<string, unknown> = {};

      // Handle text content (default: get text with 3000 characters)
      if (contents.text !== undefined) {
        contentsConfig.text = contents.text;
      } else {
        contentsConfig.text = { maxCharacters: 3000 };
      }

      // Add other content options
      if (contents.highlights !== undefined) {
        contentsConfig.highlights = contents.highlights;
      }
      if (contents.summary !== undefined) {
        contentsConfig.summary = contents.summary;
      }

      // Set livecrawl mode (default: "fallback")
      contentsConfig.livecrawl = contents.livecrawl ?? "fallback";

      if (contents.context !== undefined) {
        contentsConfig.context = contents.context;
      }

      if (contents.livecrawlTimeout) {
        contentsConfig.livecrawlTimeout = contents.livecrawlTimeout;
      }
      if (contents.subpages !== undefined) {
        contentsConfig.subpages = contents.subpages;
      }
      if (contents.subpageTarget) {
        contentsConfig.subpageTarget = contents.subpageTarget;
      }
      if (contents.extras) {
        contentsConfig.extras = contents.extras;
      }

      requestBody.contents = contentsConfig;

      const raw = await Effect.runPromise(
        postJson(
          {
            url: "https://api.exa.ai/search",
            apiKey: resolvedApiKey,
            integration: "ai-registry",
            userAgent: `ai-registry/exa ${PACKAGE_VERSION}`,
            timeoutMs: timeoutMs ?? 15000,
          },
          requestBody,
        ),
      );

      const parsed = ExaApiResponseSchema.safeParse(raw);
      if (!parsed.success) {
        throw new ExaResponseValidationError(parsed.error.issues);
      }

      return parsed.data as ExaApiResponse;
    },
  });
}

export { exaWebContents };

// Re-export types for consumers
export type {
  ExaWebSearchConfig,
  ExaApiResponse,
  ExaSearchResult,
  ContentsOptions,
  TextOptions,
  HighlightsOptions,
  SummaryOptions,
  ExtrasOptions,
  SearchType,
  SearchCategory,
  LivecrawlMode,
  ExaContentsConfig,
  ExaContentsRequest,
  ExaContentsResponse,
  ExaContentsStatus,
} from "../types.js";
