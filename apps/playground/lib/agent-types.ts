import type { FinishReason, LanguageModelUsage } from "ai";

/**
 * Agent metadata type for client-side display
 * This mirrors the server-side AgentMetadata but is safe to import in client components
 */
export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  model: string;
  tags: string[];
  inputSchemaShape: Record<
    string,
    {
      type: string;
      description?: string;
      optional?: boolean;
    }
  >;
}

/**
 * Input for running an agent
 */
export interface AgentRunInput {
  prompt: string;
  context?: string;
}

/**
 * Tool call information for display
 */
export interface ToolCallInfo {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  state: "pending" | "result";
}

/**
 * Token usage information for the playground.
 *
 * AI SDK v6+ extended usage (input/output tokens + token detail breakdowns + raw provider usage).
 */
export type RunUsage = LanguageModelUsage;

/**
 * Finish reason information for a completed generation.
 */
export interface RunFinishInfo {
  finishReason?: FinishReason;
  rawFinishReason?: string;
}

/**
 * Run state for the playground
 */
export type RunState = "idle" | "running" | "complete" | "error";
