/**
 * Text content options for Exa search results
 */
export interface TextOptions {
  /** Maximum characters for the text content (default: 3000) */
  maxCharacters?: number;
  /** Include HTML tags in the response */
  includeHtmlTags?: boolean;
}

/**
 * Summary options for AI-generated summaries
 */
export interface SummaryOptions {
  /** Custom query for the summary */
  query?: string;
  /** JSON schema for structured output */
  schema?: Record<string, unknown>;
}

/**
 * Highlights options - text snippets the LLM identifies as most relevant from each page
 */
export interface HighlightsOptions {
  /** Number of sentences to return for each snippet */
  numSentences?: number;
  /** Number of snippets to return for each result */
  highlightsPerUrl?: number;
  /** Custom query to direct the LLM's selection of highlights */
  query?: string;
}

/**
 * Extra content options
 */
export interface ExtrasOptions {
  /** Number of links to return from each page */
  links?: number;
  /** Number of image links to return */
  imageLinks?: number;
}

/**
 * Livecrawl mode for fetching content
 * - "never": Never livecrawl, only use cached content
 * - "fallback": Livecrawl if cached content is unavailable (default)
 * - "always": Always livecrawl for fresh content
 * - "preferred": Prefer livecrawl but fallback to cached
 */
export type LivecrawlMode = "never" | "fallback" | "always" | "preferred";

/**
 * Contents configuration - controls what content to retrieve from search results
 */
/**
 * Common context option for LLM usage.
 */
export type ContextOption = boolean | { maxCharacters?: number };

export interface ContentsOptions {
  /**
   * Get page text content.
   * Pass true for defaults or an object with options (default: {maxCharacters: 3000})
   */
  text?: boolean | TextOptions;
  /** Get text snippets the LLM identifies as most relevant from each page */
  highlights?: boolean | HighlightsOptions;
  /** Get AI-generated summary */
  summary?: boolean | SummaryOptions;
  /** Livecrawl mode (default: "fallback") */
  livecrawl?: LivecrawlMode;
  /** Livecrawl timeout in milliseconds */
  livecrawlTimeout?: number;
  /** Number of subpages to crawl */
  subpages?: number;
  /** Keyword to find specific subpages */
  subpageTarget?: string | string[];
  /** Extra content to retrieve */
  extras?: ExtrasOptions;
  /** Return page contents combined as a single context string */
  context?: ContextOption;
}

/**
 * Search type for Exa queries
 * - "auto": Best search, intelligently combines keyword and neural (default)
 * - "keyword": Fast keyword search
 * - "neural": Deep semantic search
 * - "fast": Streamlined versions of neural and keyword
 * - "deep": Comprehensive deep search with enhanced analysis
 */
export type SearchType = "auto" | "neural" | "fast" | "deep";

/**
 * Category to focus the search on
 */
export type SearchCategory =
  | "company"
  | "research paper"
  | "news"
  | "pdf"
  | "github"
  | "tweet"
  | "personal site"
  | "financial report"
  | "people";

/**
 * Main configuration for the Exa web search tool
 */
export interface ExaWebSearchConfig {
  /**
   * Timeout for Exa API request in milliseconds (default: 15000)
   */
  timeoutMs?: number;

  /**
   * Your Exa API key.
   * Get one at https://dashboard.exa.ai/api-keys
   * Defaults to process.env.EXA_API_KEY
   */
  apiKey?: string;

  /**
   * Search type (default: "auto")
   */
  type?: SearchType;

  /**
   * Category to focus the search on
   */
  category?: SearchCategory;

  /**
   * Two-letter ISO country code for localized results (e.g., "US")
   */
  userLocation?: string;

  /**
   * Number of results to return (default: 10)
   * Keyword max: 10, Neural max: 100
   */
  numResults?: number;

  /**
   * List of domains to include (e.g., ["arxiv.org", "github.com"])
   */
  includeDomains?: string[];

  /**
   * List of domains to exclude
   */
  excludeDomains?: string[];

  /**
   * Return results crawled after this date (ISO 8601 format)
   */
  startCrawlDate?: string;

  /**
   * Return results crawled before this date (ISO 8601 format)
   */
  endCrawlDate?: string;

  /**
   * Return results published after this date (ISO 8601 format)
   */
  startPublishedDate?: string;

  /**
   * Return results published before this date (ISO 8601 format)
   */
  endPublishedDate?: string;

  /**
   * Text that must be present in results (max 1 string, up to 5 words)
   */
  includeText?: string[];

  /**
   * Text that must not be present in results (max 1 string, up to 5 words)
   */
  excludeText?: string[];

  /**
   * Additional query variations for deep search.
   * Only works with type="deep".
   */
  additionalQueries?: string[];

  /**
   * Enable content moderation to filter unsafe content from results.
   */
  moderation?: boolean;

  /**
   * Return page contents combined as a single context string.
   */
  context?: ContextOption;

  /**
   * Contents options - what to retrieve from each result
   */
  contents?: ContentsOptions;
}

/**
 * Individual search result from Exa
 */
export interface ExaSearchResult {
  /** Title of the page */
  title: string;
  /** URL of the page */
  url: string;
  /** Unique ID for the result */
  id?: string;
  /** Published date (ISO 8601 format) */
  publishedDate?: string;
  /** Author of the content */
  author?: string;
  /** URL of an image associated with the result */
  image?: string;
  /** URL of the favicon */
  favicon?: string;
  /** Full text content of the page */
  text?: string;
  /** Array of highlights extracted from the search result content */
  highlights?: string[];
  /** Array of cosine similarity scores for each highlight */
  highlightScores?: number[];
  /** AI-generated summary */
  summary?: string;
  /** Array of subpages */
  subpages?: ExaSearchResult[];
  /** Extra content (links, images) */
  extras?: {
    links?: string[];
    imageLinks?: string[];
  };
}

/**
 * Full API response from Exa search endpoint
 */
export interface ExaApiResponse {
  /** Unique request ID */
  requestId?: string;
  /** For auto searches, indicates which search type was selected */
  searchType?: "neural" | "deep";
  /** Return page contents combined as a single context string */
  context?: string;
  /** Array of search results */
  results: ExaSearchResult[];
  /** Cost breakdown for the request */
  costDollars?: {
    total?: number;
    breakDown?: unknown;
    perRequestPrices?: Record<string, number>;
    perPagePrices?: Record<string, number>;
  };
}

export interface ExaContentsConfig {
  /**
   * Timeout for Exa API request in milliseconds (default: 15000)
   */
  timeoutMs?: number;

  /**
   * Your Exa API key.
   * Get one at https://dashboard.exa.ai/api-keys
   * Defaults to process.env.EXA_API_KEY
   */
  apiKey?: string;

  /**
   * Controls what content to retrieve from each URL.
   */
  contents?: ContentsOptions;
}

export interface ExaContentsRequest {
  /** Array of URLs to crawl */
  urls: string[];
  /** Optional legacy IDs (deprecated by Exa) */
  ids?: string[];
}

export interface ExaContentsStatus {
  id: string;
  status: "success" | "error";
  error?: {
    tag:
      | "CRAWL_NOT_FOUND"
      | "CRAWL_TIMEOUT"
      | "CRAWL_LIVECRAWL_TIMEOUT"
      | "SOURCE_NOT_AVAILABLE"
      | "CRAWL_UNKNOWN_ERROR";
    httpStatusCode?: number | null;
  } | null;
}

export interface ExaContentsResponse {
  requestId?: string;
  results: ExaSearchResult[];
  context?: string;
  statuses?: ExaContentsStatus[];
  costDollars?: {
    total?: number;
    breakDown?: unknown;
    perRequestPrices?: Record<string, number>;
    perPagePrices?: Record<string, number>;
  };
}
