import type { UIMessage } from "ai";
import { z } from "zod";

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
