"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatStatus } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import {
  messageMetadataSchema,
  PLAYGROUND_MODELS,
  type PlaygroundMessage,
} from "@/lib/playground/chat-contract";

const DEFAULT_MODEL = PLAYGROUND_MODELS[0]!;

interface UsePlaygroundChatResult {
  canRegenerate: boolean;
  currentModel: (typeof PLAYGROUND_MODELS)[number];
  messages: PlaygroundMessage[];
  regenerateLast: () => void;
  selectedModel: string;
  sendSuggestion: (suggestion: string) => void;
  setSelectedModel: (value: string) => void;
  setText: (value: string) => void;
  status: ChatStatus;
  stop: () => void;
  submit: (message: PromptInputMessage) => void;
  text: string;
}

export const usePlaygroundChat = (): UsePlaygroundChatResult => {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL.id);

  const currentModel =
    PLAYGROUND_MODELS.find((model) => model.id === selectedModel) ??
    DEFAULT_MODEL;

  const currentModelRef = useRef(currentModel);
  useEffect(() => {
    currentModelRef.current = currentModel;
  }, [currentModel]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({
          body,
          id,
          messageId,
          messages,
          requestMetadata,
          trigger,
        }) => ({
          body: {
            ...(body ?? {}),
            id,
            messageId,
            messages,
            requestMetadata,
            trigger,
            model: currentModelRef.current.id,
            provider: currentModelRef.current.provider,
          },
        }),
      }),
    [],
  );

  const { messages, status, sendMessage, regenerate, stop } =
    useChat<PlaygroundMessage>({
      transport,
      messageMetadataSchema,
    });

  const isGenerating = status === "submitted" || status === "streaming";
  const hasAssistantMessages = messages.some(
    (message) => message.role === "assistant",
  );
  const canRegenerate =
    hasAssistantMessages && !isGenerating && status !== "error";

  const submit = useCallback(
    (message: PromptInputMessage) => {
      if (!message.text.trim() && message.files.length === 0) {
        return;
      }

      sendMessage({
        text: message.text,
        files: message.files,
      });
      setText("");
    },
    [sendMessage],
  );

  const sendSuggestion = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion });
    },
    [sendMessage],
  );

  const regenerateLast = useCallback(() => {
    if (!canRegenerate) {
      return;
    }
    regenerate();
  }, [canRegenerate, regenerate]);

  return {
    canRegenerate,
    currentModel,
    messages,
    regenerateLast,
    selectedModel,
    sendSuggestion,
    setSelectedModel,
    setText,
    status,
    stop,
    submit,
    text,
  };
};
