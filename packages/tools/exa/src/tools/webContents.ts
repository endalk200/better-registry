import { tool } from "ai";
import { Effect } from "effect";
import { z } from "zod";
import type { ExaContentsConfig, ExaContentsResponse } from "../types.js";
import {
  MissingApiKeyError,
  ExaResponseValidationError,
} from "../utils/errors.js";
import { ExaContentsResponseSchema } from "../schemas/contentsResponseSchema.js";
import { postJson } from "../utils/exaHttp.js";

const PACKAGE_VERSION = "0.1.0";

const DEFAULT_DESCRIPTION =
  "Fetch full page contents, summaries, and metadata for a list of URLs using Exa. " +
  "Use this when you already have URLs and want to retrieve their text or summaries.";

const contentsInputSchema = z.object({
  urls: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one URL is required")
    .max(50, "Maximum 50 URLs allowed")
    .describe("List of URLs to fetch content for"),
});

export function exaWebContents(config: ExaContentsConfig = {}) {
  const { apiKey, toolDescription, timeoutMs, contents } = config;

  const resolvedApiKey =
    apiKey ??
    (typeof process !== "undefined" ? process.env?.EXA_API_KEY : undefined);

  return tool({
    description: toolDescription ?? DEFAULT_DESCRIPTION,
    inputSchema: contentsInputSchema,
    execute: async ({ urls }): Promise<ExaContentsResponse> => {
      if (!resolvedApiKey) {
        throw new MissingApiKeyError(
          "EXA_API_KEY is required. Set it in environment variables or pass it in config.",
        );
      }

      const requestBody: Record<string, unknown> = {
        urls,
      };

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
    },
  });
}
