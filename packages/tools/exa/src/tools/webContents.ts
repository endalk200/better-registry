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
    .array(z.string().min(1))
    .min(1)
    .max(50)
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
        requestBody.text = contents.text;
        requestBody.highlights = contents.highlights;
        requestBody.summary = contents.summary;
        requestBody.livecrawl = contents.livecrawl;
        requestBody.livecrawlTimeout = contents.livecrawlTimeout;
        requestBody.subpages = contents.subpages;
        requestBody.subpageTarget = contents.subpageTarget;
        requestBody.extras = contents.extras;
        requestBody.context = contents.context;
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
