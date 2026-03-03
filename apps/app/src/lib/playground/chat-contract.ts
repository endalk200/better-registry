import type { UIMessage } from "ai";
import { z } from "zod";

export const PLAYGROUND_MODELS = [
  { id: "gpt-4o", provider: "openai", label: "GPT-4o" },
  { id: "gpt-4o-mini", provider: "openai", label: "GPT-4o Mini" },
  {
    id: "anthropic/claude-sonnet-4",
    provider: "openrouter",
    label: "Claude Sonnet 4",
  },
  {
    id: "google/gemini-2.0-flash",
    provider: "openrouter",
    label: "Gemini 2.0 Flash",
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct",
    provider: "openrouter",
    label: "Llama 3.1 70B",
  },
] as const;

export const PLAYGROUND_SUGGESTIONS = [
  "Explain how transformers work in simple terms",
  "Write a TypeScript utility type that makes all nested properties optional",
  "Compare REST vs GraphQL for a new project",
  "Generate a regex that validates email addresses",
] as const;

export const playgroundProviderSchema = z.enum(["openai", "openrouter"]);
export type PlaygroundProvider = z.infer<typeof playgroundProviderSchema>;

const providerModelAllowlist = PLAYGROUND_MODELS.reduce(
  (acc, model) => {
    acc[model.provider].push(model.id);
    return acc;
  },
  {
    openai: [] as string[],
    openrouter: [] as string[],
  },
);

export const PLAYGROUND_PROVIDER_MODEL_ALLOWLIST = Object.freeze({
  openai: Object.freeze([...providerModelAllowlist.openai]),
  openrouter: Object.freeze([...providerModelAllowlist.openrouter]),
}) satisfies Record<PlaygroundProvider, readonly string[]>;

export const CHAT_LIMITS = {
  maxMessages: 40,
  maxPayloadBytes: 200_000,
  maxTextPartLength: 8_000,
  maxTotalTextLength: 20_000,
} as const;

export const messageMetadataSchema = z.object({
  model: z.string().optional(),
  provider: z.string().optional(),
  createdAt: z.number().optional(),
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
  totalTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type PlaygroundMessage = UIMessage<MessageMetadata>;

const chatMessagePartSchema = z
  .object({
    type: z.string(),
    text: z.string().optional(),
  })
  .passthrough();

const chatMessageSchema = z
  .object({
    id: z.string().min(1),
    role: z.enum(["system", "user", "assistant"]),
    parts: z.array(chatMessagePartSchema).min(1),
    metadata: messageMetadataSchema.optional(),
  })
  .passthrough();

export const isAllowedModelForProvider = (
  provider: PlaygroundProvider,
  model: string,
): boolean =>
  (PLAYGROUND_PROVIDER_MODEL_ALLOWLIST[provider] as readonly string[]).includes(
    model,
  );

export const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(CHAT_LIMITS.maxMessages),
    provider: playgroundProviderSchema,
    model: z.string().min(1),
    requestMetadata: z.unknown().optional(),
  })
  .superRefine((value, ctx) => {
    if (!isAllowedModelForProvider(value.provider, value.model)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Model is not allowed for provider.",
        path: ["model"],
      });
    }

    let totalTextLength = 0;
    for (const message of value.messages) {
      for (const part of message.parts) {
        if (part.type !== "text") {
          continue;
        }

        if (typeof part.text !== "string") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Text part must include text content.",
            path: ["messages"],
          });
          continue;
        }

        if (part.text.length > CHAT_LIMITS.maxTextPartLength) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Text part exceeds allowed length.",
            path: ["messages"],
          });
        }

        totalTextLength += part.text.length;
      }
    }

    if (totalTextLength > CHAT_LIMITS.maxTotalTextLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total text content exceeds allowed length.",
        path: ["messages"],
      });
    }
  })
  .transform((value) => ({
    ...value,
    messages: value.messages as PlaygroundMessage[],
  }));

export const chatErrorCodeSchema = z.enum([
  "forbidden",
  "invalid_json",
  "invalid_request",
  "provider_not_configured",
  "rate_limited",
  "request_too_large",
  "unauthorized",
  "unknown",
]);

export const chatErrorResponseSchema = z.object({
  error: z.object({
    code: chatErrorCodeSchema,
    message: z.string(),
  }),
});

export type ChatErrorCode = z.infer<typeof chatErrorCodeSchema>;
