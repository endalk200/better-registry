/**
 * @ai-registry/exa
 *
 * Exa API tools with SDK-agnostic core and adapters for various AI SDKs.
 *
 * ## Usage
 *
 * ### With Vercel AI SDK
 * ```ts
 * import { createExaWebSearchTool, createExaWebContentsTool } from "@ai-registry/exa";
 * // or explicitly:
 * import { createExaWebSearchTool, createExaWebContentsTool } from "@ai-registry/exa/ai-sdk";
 * ```
 *
 * ### With TanStack AI
 * ```ts
 * import { createTanstackExaWebSearchTool, createTanstackExaWebContentsTool } from "@ai-registry/exa/tanstack-ai";
 * ```
 *
 * ### Core functions (SDK-agnostic)
 * ```ts
 * import { webSearch, webContents } from "@ai-registry/exa/core";
 *
 * const results = await webSearch({ query: "AI news" }, { apiKey: "..." });
 * ```
 */

// AI SDK tools (default export)
export {
  createExaWebSearchTool,
  createExaWebContentsTool,
  type ExaToolOptions,
} from "./adapters/ai-sdk.js";

// TanStack AI tools
export {
  createTanstackExaWebSearchTool,
  createTanstackExaWebContentsTool,
} from "./adapters/tanstack-ai.js";

// Re-export all types
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
  ContextOption,
  ExaContentsConfig,
  ExaContentsRequest,
  ExaContentsResponse,
  ExaContentsStatus,
} from "./types.js";

export type { ExaHttpOptions } from "./utils/exaHttp.js";

export {
  MissingApiKeyError,
  ExaHttpError,
  ExaTimeoutError,
  ExaResponseValidationError,
} from "./utils/errors.js";
