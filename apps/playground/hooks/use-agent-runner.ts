"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { useState, useCallback, useMemo } from "react";
import { DefaultChatTransport } from "ai";
import type {
  AgentMetadata,
  RunFinishInfo,
  RunState,
  RunUsage,
  ToolCallInfo,
} from "@/lib/agent-types";

interface UseAgentRunnerOptions {
  agent: AgentMetadata | null;
}

interface UseAgentRunnerReturn {
  // State
  runState: RunState;
  messages: UIMessage[];
  error: string | null;

  // Derived data
  responseText: string;
  toolCalls: ToolCallInfo[];
  usage: RunUsage | null;
  finishInfo: RunFinishInfo | null;

  // Actions
  runAgent: (prompt: string, context?: string) => Promise<void>;
  stopRun: () => void;
  clearRun: () => void;
}

export function useAgentRunner({
  agent,
}: UseAgentRunnerOptions): UseAgentRunnerReturn {
  const [runState, setRunState] = useState<RunState>("idle");
  const [error, setError] = useState<string | null>(null);

  type PlaygroundMessageMetadata = {
    usage?: RunUsage;
    finishReason?: RunFinishInfo["finishReason"];
    rawFinishReason?: string;
  };
  type PlaygroundUIMessage = UIMessage<PlaygroundMessageMetadata>;

  // `useChat` only recreates its underlying chat instance when `id` changes.
  // Tie it to the selected agent so the request transport updates correctly
  // when agents load or the selection changes.
  const chatId = agent?.id ?? "no-agent-selected";

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: agent
        ? `/api/playground/agents/${agent.id}`
        : "/api/playground/agents",
    });
  }, [agent]);

  const { messages, sendMessage, stop, setMessages, status } =
    useChat<PlaygroundUIMessage>({
      id: chatId,
      transport,
      onFinish: () => {
        setRunState("complete");
      },
      onError: (err) => {
        setRunState("error");
        setError(err instanceof Error ? err.message : "Agent run failed");
      },
    });

  // Extract response text from the last assistant message
  const responseText = useMemo(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    if (assistantMessages.length === 0) return "";

    const lastMessage = assistantMessages.at(-1);
    if (!lastMessage) return "";

    return lastMessage.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  }, [messages]);

  // Extract usage + finish info from message metadata (AI SDK v6 approach)
  const { usage, finishInfo } = useMemo(() => {
    const assistantMessages = messages.filter((m) => m.role === "assistant");
    const last = assistantMessages.at(-1);
    const md = last?.metadata;

    const u = md?.usage ?? null;
    const fi =
      md?.finishReason || md?.rawFinishReason
        ? {
            finishReason: md?.finishReason,
            rawFinishReason: md?.rawFinishReason,
          }
        : null;

    return { usage: u, finishInfo: fi };
  }, [messages]);

  // Extract tool calls from messages
  const toolCalls = useMemo(() => {
    const calls: ToolCallInfo[] = [];

    for (const message of messages) {
      if (message.role === "assistant" && Array.isArray(message.parts)) {
        for (const part of message.parts) {
          const isStaticTool =
            typeof part.type === "string" && part.type.startsWith("tool-");
          const isDynamicTool = part.type === "dynamic-tool";

          if (isStaticTool || isDynamicTool) {
            const toolCallId =
              "toolCallId" in part && typeof part.toolCallId === "string"
                ? part.toolCallId
                : `unknown-${Date.now()}`;

            const toolName = isDynamicTool
              ? "toolName" in part && typeof part.toolName === "string"
                ? part.toolName
                : "unknown"
              : String(part.type).slice("tool-".length);

            const args =
              "input" in part && part.input !== undefined
                ? (part.input as Record<string, unknown>)
                : {};

            const existingIndex = calls.findIndex(
              (c) => c.toolCallId === toolCallId
            );

            const isResult =
              "state" in part &&
              (part.state === "output-available" ||
                part.state === "output-error" ||
                part.state === "output-denied");

            const result = (() => {
              if (!("state" in part)) return undefined;
              if (part.state === "output-available" && "output" in part) {
                return part.output;
              }
              if (part.state === "output-error" && "errorText" in part) {
                return { error: part.errorText };
              }
              if (part.state === "output-denied" && "approval" in part) {
                return { denied: true, reason: part.approval?.reason };
              }
              return undefined;
            })();

            if (existingIndex >= 0) {
              // Update existing call with result
              const existing = calls[existingIndex];
              if (existing && isResult) {
                calls[existingIndex] = {
                  ...existing,
                  result,
                  state: "result",
                };
              }
            } else {
              calls.push({
                toolCallId,
                toolName,
                args,
                result: isResult ? result : undefined,
                state: isResult ? "result" : "pending",
              });
            }
          }
        }
      }
    }

    return calls;
  }, [messages]);

  // Extract usage information (if available in response metadata)
  // AI SDK provides usage in `onFinish` callback options (when supported by provider).

  const runAgent = useCallback(
    async (prompt: string, context?: string) => {
      if (!agent) return;

      setRunState("running");
      setError(null);
      setMessages([]);

      const content = context ? `${prompt}\n\nContext: ${context}` : prompt;

      try {
        // `messageId` is only used for replacing an existing message.
        // For a new message, omit it so the SDK can generate a fresh id.
        await sendMessage({ text: content });
      } catch (err) {
        setRunState("error");
        setError(
          err instanceof Error ? err.message : "Failed to start agent request"
        );
      }
    },
    [agent, sendMessage, setMessages]
  );

  const stopRun = useCallback(() => {
    void stop();
    setRunState("idle");
  }, [stop]);

  const clearRun = useCallback(() => {
    setMessages([]);
    setRunState("idle");
    setError(null);
  }, [setMessages]);

  return {
    runState:
      status === "submitted" || status === "streaming" ? "running" : runState,
    messages,
    error,
    responseText,
    toolCalls,
    usage,
    finishInfo,
    runAgent,
    stopRun,
    clearRun,
  };
}
