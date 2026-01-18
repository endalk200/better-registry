/**
 * @ai-registry/exa
 *
 * Exa API tools with SDK-agnostic core and adapters for various AI SDKs.
 *
 * ## Usage
 *
 * ### With Vercel AI SDK
 * ```ts
 * import { exaWebSearch, exaWebContents } from "@ai-registry/exa";
 * // or explicitly:
 * import { exaWebSearch, exaWebContents } from "@ai-registry/exa/ai-sdk";
 * ```
 *
 * ### Core functions (SDK-agnostic)
 * ```ts
 * import { webSearch, webContents } from "@ai-registry/exa/core";
 *
 * const results = await webSearch({ query: "AI news" }, { apiKey: "..." });
 * ```
 */

// Default export: AI SDK tools
export { exaWebSearch, exaWebContents } from "./adapters/ai-sdk.js";

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
