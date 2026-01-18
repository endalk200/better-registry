/**
 * Core SDK-agnostic implementations for Exa API.
 * Use these functions directly or wrap them with your preferred AI SDK adapter.
 */

export { webSearch } from "./webSearch.js";
export type { WebSearchOptions, WebSearchInput } from "./webSearch.js";

export { webContents } from "./webContents.js";
export type { WebContentsOptions, WebContentsInput } from "./webContents.js";

// Re-export types that are useful for core usage
export type {
  ExaApiResponse,
  ExaSearchResult,
  ExaContentsResponse,
  ExaContentsStatus,
  ContentsOptions,
  TextOptions,
  HighlightsOptions,
  SummaryOptions,
  ExtrasOptions,
  SearchType,
  SearchCategory,
  LivecrawlMode,
  ContextOption,
} from "../types.js";

// Re-export errors
export {
  MissingApiKeyError,
  ExaHttpError,
  ExaTimeoutError,
  ExaResponseValidationError,
} from "../utils/errors.js";
