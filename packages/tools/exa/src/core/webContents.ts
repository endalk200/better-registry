import { Effect } from "effect";
import type { ExaContentsConfig, ExaContentsResponse } from "../types.js";
import {
  MissingApiKeyError,
  ExaResponseValidationError,
} from "../utils/errors.js";
import { ExaContentsResponseSchema } from "../schemas/contentsResponseSchema.js";
import { postJson } from "../utils/exaHttp.js";

const PACKAGE_VERSION = "0.1.0";

/**
 * Configuration for the core web contents function.
 * Excludes tool-specific options like toolDescription.
 */
export type WebContentsOptions = Omit<ExaContentsConfig, "toolDescription">;

/**
 * Input parameters for fetching web contents.
 */
export interface WebContentsInput {
  /** List of URLs to fetch content for */
  urls: string[];
}

/**
 * Builds the request body for the Exa contents API.
 */
function buildContentsRequestBody(
  urls: string[],
  options: Omit<WebContentsOptions, "apiKey" | "timeoutMs">,
): Record<string, unknown> {
  const requestBody: Record<string, unknown> = {
    urls,
  };

  const contents = options.contents;
  if (contents) {
    if (contents.text === true) {
      requestBody.text = true;
    } else if (typeof contents.text === "object") {
      requestBody.text = contents.text;
    }
    // text === false or undefined: omit from request

    if (contents.highlights === true) {
      requestBody.highlights = true;
    } else if (typeof contents.highlights === "object") {
      requestBody.highlights = contents.highlights;
    }
    // highlights === false or undefined: omit from request

    if (contents.summary === true) {
      requestBody.summary = true;
    } else if (typeof contents.summary === "object") {
      requestBody.summary = contents.summary;
    }
    // summary === false or undefined: omit from request

    if (contents.livecrawl !== undefined) {
      requestBody.livecrawl = contents.livecrawl;
    }
    if (contents.livecrawlTimeout !== undefined) {
      requestBody.livecrawlTimeout = contents.livecrawlTimeout;
    }
    if (contents.subpages !== undefined) {
      requestBody.subpages = contents.subpages;
    }
    if (contents.subpageTarget !== undefined) {
      requestBody.subpageTarget = contents.subpageTarget;
    }
    if (contents.extras !== undefined) {
      requestBody.extras = contents.extras;
    }
    if (contents.context !== undefined) {
      requestBody.context = contents.context;
    }
  }

  return requestBody;
}

/**
 * Core web contents function powered by Exa.
 * Fetches full page contents, summaries, and metadata for a list of URLs.
 * This is the SDK-agnostic implementation that can be used directly or wrapped by SDK adapters.
 *
 * @param input - The input containing URLs to fetch
 * @param options - Configuration options for content fetching
 * @returns The contents response from Exa
 *
 * @example Basic usage
 * ```ts
 * import { webContents } from "@ai-registry/exa/core";
 *
 * const contents = await webContents(
 *   { urls: ["https://example.com/article"] },
 *   { apiKey: "your-api-key" }
 * );
 * ```
 *
 * @example With custom configuration
 * ```ts
 * const contents = await webContents(
 *   { urls: ["https://example.com/page1", "https://example.com/page2"] },
 *   {
 *     apiKey: process.env.EXA_API_KEY,
 *     contents: {
 *       text: { maxCharacters: 10000 },
 *       summary: true,
 *       livecrawl: "always",
 *     },
 *   }
 * );
 * ```
 */
export async function webContents(
  input: WebContentsInput,
  options: WebContentsOptions = {},
): Promise<ExaContentsResponse> {
  const { apiKey, timeoutMs, contents } = options;

  // Get API key from options or environment
  const resolvedApiKey =
    apiKey ??
    (typeof process !== "undefined" ? process.env?.EXA_API_KEY : undefined);

  if (!resolvedApiKey) {
    throw new MissingApiKeyError(
      "EXA_API_KEY is required. Set it in environment variables or pass it in options.",
    );
  }

  const requestBody = buildContentsRequestBody(input.urls, { contents });

  const raw = await Effect.runPromise(
    postJson(
      {
        url: "https://api.exa.ai/contents",
        apiKey: resolvedApiKey,
        integration: "ai-registry",
        userAgent: `ai-registry/exa ${PACKAGE_VERSION}`,
        timeoutMs: timeoutMs ?? 15000,
      },
      requestBody,
    ),
  );

  const parsed = ExaContentsResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ExaResponseValidationError(parsed.error.issues);
  }

  return parsed.data as ExaContentsResponse;
}
