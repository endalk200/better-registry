import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";
import { webSearch, type WebSearchOptions } from "../core/webSearch.js";
import { webContents, type WebContentsOptions } from "../core/webContents.js";
import { ExaApiResponseSchema } from "../schemas/searchResponseSchema.js";
import { ExaContentsResponseSchema } from "../schemas/contentsResponseSchema.js";
import type { ExaToolOptions } from "./types.js";

const webSearchInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(500)
    .describe(
      "The web search query - be specific and clear about what you're looking for",
    ),
});

const DEFAULT_SEARCH_DESCRIPTION =
  "Search the web for current information, documentation, news, articles, and research. " +
  "Use this when you need up-to-date information, facts from the internet, or to find specific content. " +
  "Performs real-time web searches with optional content scraping.";

const webSearchToolDef = toolDefinition({
  name: "exa_web_search",
  description: DEFAULT_SEARCH_DESCRIPTION,
  inputSchema: webSearchInputSchema,
  outputSchema: ExaApiResponseSchema,
});

const DEFAULT_CONTENTS_DESCRIPTION =
  "Fetch full page contents, summaries, and metadata for a list of URLs using Exa. " +
  "Use this when you already have URLs and want to retrieve their text or summaries.";

const contentsInputSchema = z.object({
  urls: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one URL is required")
    .max(50, "Maximum 50 URLs allowed")
    .describe("List of URLs to fetch content for"),
});

const webContentsToolDef = toolDefinition({
  name: "exa_web_contents",
  description: DEFAULT_CONTENTS_DESCRIPTION,
  inputSchema: contentsInputSchema,
  outputSchema: ExaContentsResponseSchema,
});

/**
 * Creates a web search tool powered by Exa for use with TanStack AI.
 *
 * @param config - Configuration options for the Exa search (core options only)
 * @param toolOptions - Tool-specific options like custom description
 * @returns A server tool that can be used with TanStack AI's chat function
 *
 * @example Basic usage with environment variable
 * ```ts
 * import { chat } from "@tanstack/ai";
 * import { openaiText } from "@tanstack/ai-openai";
 * import { createTanstackExaWebSearchTool } from "@ai-registry/exa/tanstack-ai";
 *
 * // Set EXA_API_KEY in your environment
 * const searchTool = createTanstackExaWebSearchTool();
 *
 * const result = chat({
 *   adapter: openaiText("gpt-4o-mini"),
 *   messages: [{ role: "user", content: "What are the latest developments in AI?" }],
 *   tools: [searchTool],
 * });
 *
 * for await (const chunk of result) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const searchTool = createTanstackExaWebSearchTool(
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
 */
export function createTanstackExaWebSearchTool(
  config: WebSearchOptions = {},
  toolOptions: ExaToolOptions = {},
) {
  // Create tool definition with custom description if provided
  const def = toolOptions.description
    ? toolDefinition({
        name: "exa_web_search",
        description: toolOptions.description,
        inputSchema: webSearchInputSchema,
        outputSchema: ExaApiResponseSchema,
      })
    : webSearchToolDef;

  return def.server(async ({ query }) => {
    const result = await webSearch({ query }, config);
    return result;
  });
}

/**
 * Creates a web contents tool powered by Exa for use with TanStack AI.
 *
 * @param config - Configuration options for fetching contents (core options only)
 * @param toolOptions - Tool-specific options like custom description
 * @returns A server tool that can be used with TanStack AI's chat function
 *
 * @example Basic usage
 * ```ts
 * import { chat } from "@tanstack/ai";
 * import { openaiText } from "@tanstack/ai-openai";
 * import { createTanstackExaWebContentsTool } from "@ai-registry/exa/tanstack-ai";
 *
 * const contentsTool = createTanstackExaWebContentsTool();
 *
 * const result = chat({
 *   adapter: openaiText("gpt-4o-mini"),
 *   messages: [{ role: "user", content: "Summarize: https://example.com/article" }],
 *   tools: [contentsTool],
 * });
 *
 * for await (const chunk of result) {
 *   console.log(chunk);
 * }
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const contentsTool = createTanstackExaWebContentsTool(
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
export function createTanstackExaWebContentsTool(
  config: WebContentsOptions = {},
  toolOptions: ExaToolOptions = {},
) {
  // Create tool definition with custom description if provided
  const def = toolOptions.description
    ? toolDefinition({
        name: "exa_web_contents",
        description: toolOptions.description,
        inputSchema: contentsInputSchema,
        outputSchema: ExaContentsResponseSchema,
      })
    : webContentsToolDef;

  return def.server(async ({ urls }) => {
    const result = await webContents({ urls }, config);
    return result;
  });
}

export type { WebSearchOptions, WebContentsOptions, ExaToolOptions };
