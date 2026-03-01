import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import type { PlaygroundMessage } from "@/app/playground/types";

export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    messages,
    model,
    provider,
  }: {
    messages: PlaygroundMessage[];
    model: string;
    provider: "openai" | "openrouter";
  } = await req.json();

  const resolvedModel =
    provider === "openrouter" ? openrouter(model) : openai(model);

  const result = streamText({
    model: resolvedModel,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
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
}
