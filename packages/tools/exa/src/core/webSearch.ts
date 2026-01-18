import { Effect } from "effect";
import type {
  ExaWebSearchConfig,
  ExaApiResponse,
  ContentsOptions,
} from "../types.js";
import {
  MissingApiKeyError,
  ExaResponseValidationError,
} from "../utils/errors.js";
import { ExaApiResponseSchema } from "../schemas/searchResponseSchema.js";
import { postJson } from "../utils/exaHttp.js";

const PACKAGE_VERSION = "0.1.0";

/**
 * Configuration for the core web search function.
 * Excludes tool-specific options like toolDescription.
 */
export type WebSearchOptions = Omit<ExaWebSearchConfig, "toolDescription">;

/**
 * Input parameters for performing a web search.
 */
export interface WebSearchInput {
  /** The search query */
  query: string;
}

/**
 * Builds the contents configuration for the Exa API request.
 */
function buildContentsConfig(
  contents: ContentsOptions = {},
): Record<string, unknown> {
  const contentsConfig: Record<string, unknown> = {};

  // Handle text content (default: get text with 3000 characters)
  if (contents.text === false) {
    // Explicitly disabled - don't include in request
  } else if (contents.text === true) {
    contentsConfig.text = { maxCharacters: 3000 };
  } else if (contents.text !== undefined) {
    contentsConfig.text = contents.text;
  } else {
    contentsConfig.text = { maxCharacters: 3000 };
  }

  // Handle highlights (disabled by default)
  if (contents.highlights === false) {
    // Explicitly disabled - don't include in request
  } else if (contents.highlights === true) {
    contentsConfig.highlights = true;
  } else if (contents.highlights !== undefined) {
    contentsConfig.highlights = contents.highlights;
  }

  // Handle summary (disabled by default)
  if (contents.summary === false) {
    // Explicitly disabled - don't include in request
  } else if (contents.summary === true) {
    contentsConfig.summary = true;
  } else if (contents.summary !== undefined) {
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

  return contentsConfig;
}

/**
 * Builds the request body for the Exa search API.
 */
function buildSearchRequestBody(
  query: string,
  options: Omit<WebSearchOptions, "apiKey" | "timeoutMs">,
): Record<string, unknown> {
  const requestBody: Record<string, unknown> = {
    query,
    type: options.type ?? "auto",
    numResults: options.numResults ?? 10,
  };

  if (options.additionalQueries?.length) {
    requestBody.additionalQueries = options.additionalQueries;
  }

  if (options.moderation !== undefined) {
    requestBody.moderation = options.moderation;
  }

  if (options.context !== undefined) {
    requestBody.context = options.context;
  }

  // Add optional search parameters
  if (options.category) {
    requestBody.category = options.category;
  }
  if (options.userLocation) {
    requestBody.userLocation = options.userLocation;
  }
  if (options.includeDomains && options.includeDomains.length > 0) {
    requestBody.includeDomains = options.includeDomains;
  }
  if (options.excludeDomains && options.excludeDomains.length > 0) {
    requestBody.excludeDomains = options.excludeDomains;
  }
  if (options.startCrawlDate) {
    requestBody.startCrawlDate = options.startCrawlDate;
  }
  if (options.endCrawlDate) {
    requestBody.endCrawlDate = options.endCrawlDate;
  }
  if (options.startPublishedDate) {
    requestBody.startPublishedDate = options.startPublishedDate;
  }
  if (options.endPublishedDate) {
    requestBody.endPublishedDate = options.endPublishedDate;
  }
  if (options.includeText && options.includeText.length > 0) {
    requestBody.includeText = options.includeText;
  }
  if (options.excludeText && options.excludeText.length > 0) {
    requestBody.excludeText = options.excludeText;
  }

  requestBody.contents = buildContentsConfig(options.contents);

  return requestBody;
}

/**
 * Core web search function powered by Exa.
 * This is the SDK-agnostic implementation that can be used directly or wrapped by SDK adapters.
 *
 * @param input - The search input containing the query
 * @param options - Configuration options for the search
 * @returns The search results from Exa
 *
 * @example Basic usage
 * ```ts
 * import { webSearch } from "@ai-registry/exa/core";
 *
 * const results = await webSearch(
 *   { query: "latest AI developments" },
 *   { apiKey: "your-api-key" }
 * );
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const results = await webSearch(
 *   { query: "machine learning papers" },
 *   {
 *     apiKey: process.env.EXA_API_KEY,
 *     numResults: 5,
 *     type: "neural",
 *     category: "research paper",
 *     contents: {
 *       text: { maxCharacters: 5000 },
 *       highlights: true,
 *     },
 *   }
 * );
 * ```
 */
export async function webSearch(
  input: WebSearchInput,
  options: WebSearchOptions = {},
): Promise<ExaApiResponse> {
  const { apiKey, timeoutMs, ...searchOptions } = options;

  // Get API key from options or environment
  const resolvedApiKey =
    apiKey ??
    (typeof process !== "undefined" ? process.env?.EXA_API_KEY : undefined);

  if (!resolvedApiKey) {
    throw new MissingApiKeyError(
      "EXA_API_KEY is required. Set it in environment variables or pass it in options.",
    );
  }

  const requestBody = buildSearchRequestBody(input.query, searchOptions);

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
}
