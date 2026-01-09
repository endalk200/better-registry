import { Effect } from "effect";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as FetchHttpClient from "@effect/platform/FetchHttpClient";
import { ExaHttpError, ExaTimeoutError } from "./errors.js";

export interface ExaHttpOptions {
  url: string;
  apiKey: string;
  userAgent: string;
  integration: string;
  timeoutMs: number;
}

export const postJson = (options: ExaHttpOptions, body: unknown) => {
  const request = HttpClientRequest.post(options.url).pipe(
    HttpClientRequest.setHeader("Content-Type", "application/json"),
    HttpClientRequest.setHeader("x-api-key", options.apiKey),
    HttpClientRequest.setHeader("x-exa-integration", options.integration),
    HttpClientRequest.setHeader("User-Agent", options.userAgent),
    HttpClientRequest.bodyUnsafeJson(body),
  );

  const program = HttpClient.HttpClient.pipe(
    Effect.flatMap((client) => client.execute(request)),
    Effect.timeout(options.timeoutMs),
    Effect.catchTag("TimeoutException", () =>
      Effect.fail(new ExaTimeoutError(options.timeoutMs)),
    ),
    Effect.flatMap((response) =>
      response.status >= 200 && response.status < 300
        ? response.json
        : response.text.pipe(
            Effect.flatMap((text) =>
              Effect.fail(new ExaHttpError(response.status, String(text))),
            ),
          ),
    ),
  );

  return program.pipe(Effect.provide(FetchHttpClient.layer));
};
