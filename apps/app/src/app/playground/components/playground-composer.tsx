"use client";

import type { ChatStatus } from "ai";
import React from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { PLAYGROUND_MODELS } from "@/lib/playground/chat-contract";

export interface PlaygroundComposerProps {
  text: string;
  status: ChatStatus;
  selectedModel: string;
  onTextChange: (value: string) => void;
  onSubmit: (message: PromptInputMessage) => void;
  onStop: () => void;
  onSelectedModelChange: (model: string) => void;
}

export const PlaygroundComposer = ({
  text,
  status,
  selectedModel,
  onTextChange,
  onSubmit,
  onStop,
  onSelectedModelChange,
}: PlaygroundComposerProps) => {
  const isGenerating = status === "submitted" || status === "streaming";

  return (
    <div className="border-t border-border/60 bg-background px-4 py-3">
      <PromptInput onSubmit={onSubmit} className="mx-auto max-w-3xl">
        <PromptInputBody>
          <PromptInputTextarea
            aria-label="Message input"
            value={text}
            onChange={(event) => onTextChange(event.currentTarget.value)}
            placeholder="Send a message..."
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputSelect
              value={selectedModel}
              onValueChange={onSelectedModelChange}
            >
              <PromptInputSelectTrigger>
                <PromptInputSelectValue />
              </PromptInputSelectTrigger>
              <PromptInputSelectContent>
                {PLAYGROUND_MODELS.map((model) => (
                  <PromptInputSelectItem key={model.id} value={model.id}>
                    {model.label}
                  </PromptInputSelectItem>
                ))}
              </PromptInputSelectContent>
            </PromptInputSelect>
          </PromptInputTools>
          <PromptInputSubmit
            disabled={!text.trim() && !isGenerating}
            onStop={onStop}
            status={status}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};
