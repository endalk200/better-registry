import { convertToModelMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import {
  type ChatErrorCode,
  type PlaygroundMessage,
  CHAT_LIMITS,
  chatRequestSchema,
} from "@/lib/playground/chat-contract";
import { enforceChatAccess } from "@/lib/playground/chat-security";

export const maxDuration = 60;

const LOG_PREFIX = "[playground-chat]";

const createErrorResponse = (
  status: number,
  code: ChatErrorCode,
  message: string,
) =>
  Response.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );

const isProviderConfigured = (provider: "openai" | "openrouter"): boolean => {
  if (provider === "openai") {
    return Boolean(process.env.OPENAI_API_KEY);
  }
  return Boolean(process.env.OPENROUTER_API_KEY);
};

export async function POST(req: Request) {
  const accessGuard = enforceChatAccess(req);
  if (!accessGuard.ok) {
    return createErrorResponse(
      accessGuard.error.status,
      accessGuard.error.code,
      accessGuard.error.message,
    );
  }

  const contentLength = Number.parseInt(
    req.headers.get("content-length") ?? "",
    10,
  );
  if (
    !Number.isNaN(contentLength) &&
    contentLength > CHAT_LIMITS.maxPayloadBytes
  ) {
    return createErrorResponse(
      413,
      "request_too_large",
      "Request payload exceeds allowed size.",
    );
  }

  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch {
    return createErrorResponse(
      400,
      "invalid_json",
      "Unable to read request body.",
    );
  }

  const payloadSize = new TextEncoder().encode(rawBody).length;
  if (payloadSize > CHAT_LIMITS.maxPayloadBytes) {
    return createErrorResponse(
      413,
      "request_too_large",
      "Request payload exceeds allowed size.",
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return createErrorResponse(
      400,
      "invalid_json",
      "Request body must be valid JSON.",
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return createErrorResponse(
      400,
      "invalid_request",
      "Request body is invalid.",
    );
  }

  const { messages, model, provider } = parsed.data as {
    messages: PlaygroundMessage[];
    model: string;
    provider: "openai" | "openrouter";
  };

  if (!isProviderConfigured(provider)) {
    return createErrorResponse(
      503,
      "provider_not_configured",
      `Provider "${provider}" is not configured on the server.`,
    );
  }

  try {
    const resolvedModel =
      provider === "openrouter" ? openrouter(model) : openai(model);

    const result = streamText({
      model: resolvedModel,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onError: (error) => {
        console.error(LOG_PREFIX, {
          code: "stream_error",
          error,
          model,
          provider,
        });
        return "Something went wrong while generating the response.";
      },
      messageMetadata: ({ part }) => {
        if (part.type === "start") {
          return {
            model,
            provider,
            createdAt: Date.now(),
          };
        }
        if (part.type === "finish") {
          return {
            inputTokens: part.totalUsage.inputTokens,
            outputTokens: part.totalUsage.outputTokens,
            totalTokens: part.totalUsage.totalTokens,
          };
        }
      },
    });
  } catch (error) {
    console.error(LOG_PREFIX, {
      code: "request_failed",
      error,
      model,
      provider,
    });

    return createErrorResponse(
      500,
      "unknown",
      "Unable to process chat request right now.",
    );
  }
}
