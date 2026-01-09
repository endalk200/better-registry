export { exaWebSearch } from "./tools/webSearch.js";
export { exaWebContents } from "./tools/webContents.js";

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
