"use client";

import React from "react";
import { Fragment } from "react";
import { CopyIcon, Hash, MessageSquare, RefreshCcwIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Spinner } from "@/components/ui/spinner";
import {
  PLAYGROUND_SUGGESTIONS,
  type MessageMetadata,
  type PlaygroundMessage,
} from "@/lib/playground/chat-contract";

const TokenBadge = ({ metadata }: { metadata?: MessageMetadata }) => {
  if (!metadata?.totalTokens) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground tabular-nums">
      <Hash className="size-2.5" />
      {metadata.totalTokens.toLocaleString()} tokens
      {metadata.inputTokens != null && metadata.outputTokens != null && (
        <span className="text-muted-foreground/60">
          ({metadata.inputTokens} + {metadata.outputTokens})
        </span>
      )}
    </span>
  );
};

export interface PlaygroundTranscriptProps {
  messages: PlaygroundMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
  canRegenerate: boolean;
  onRegenerate: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

export const PlaygroundTranscript = ({
  messages,
  status,
  canRegenerate,
  onRegenerate,
  onSuggestionClick,
}: PlaygroundTranscriptProps) => (
  <Conversation>
    <ConversationContent className="gap-0 p-0">
      {messages.length === 0 ? (
        <ConversationEmptyState className="gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/50">
              <MessageSquare className="size-7 text-muted-foreground" />
            </div>
            <div className="space-y-1 text-center">
              <h2 className="text-base font-semibold tracking-tight">
                AI SDK Playground
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Test models from OpenAI and OpenRouter. No tools, no agents -
                just the raw model.
              </p>
            </div>
          </div>
          <Suggestions className="max-w-lg">
            {PLAYGROUND_SUGGESTIONS.map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={onSuggestionClick}
              />
            ))}
          </Suggestions>
        </ConversationEmptyState>
      ) : (
        messages.map((message, messageIndex) => {
          const metadata = message.metadata as MessageMetadata | undefined;
          const isLast = messageIndex === messages.length - 1;
          const textParts = message.parts.filter(
            (part): part is { type: "text"; text: string } =>
              part.type === "text" && typeof part.text === "string",
          );
          const assistantText = textParts.map((part) => part.text).join("\n");

          return (
            <div
              key={message.id}
              className="group/msg border-b border-border/40 px-4 py-6 last:border-0 sm:px-6"
            >
              <div className="mx-auto max-w-3xl">
                <Message from={message.role}>
                  <MessageContent>
                    {textParts.map((part, index) => {
                      return (
                        <Fragment key={`${message.id}-${index}`}>
                          <MessageResponse>{part.text}</MessageResponse>
                        </Fragment>
                      );
                    })}

                    {message.role === "assistant" && (
                      <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover/msg:opacity-100 group-focus-within/msg:opacity-100">
                        <MessageActions className="mt-0!">
                          <MessageAction
                            tooltip="Copy"
                            label="Copy"
                            onClick={() => {
                              void navigator.clipboard.writeText(assistantText);
                            }}
                          >
                            <CopyIcon className="size-3" />
                          </MessageAction>
                          {isLast && (
                            <MessageAction
                              tooltip="Regenerate"
                              label="Regenerate"
                              disabled={!canRegenerate}
                              onClick={onRegenerate}
                            >
                              <RefreshCcwIcon className="size-3" />
                            </MessageAction>
                          )}
                        </MessageActions>
                        <TokenBadge metadata={metadata} />
                      </div>
                    )}
                  </MessageContent>
                </Message>
              </div>
            </div>
          );
        })
      )}
      {status === "submitted" && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}
    </ConversationContent>
    {messages.length > 0 && (
      <ConversationDownload
        messages={messages.map((message) => ({
          role: message.role,
          content: message.parts
            .filter(
              (part): part is { type: "text"; text: string } =>
                part.type === "text",
            )
            .map((part) => part.text)
            .join("\n"),
        }))}
        className="absolute right-4 top-4"
      />
    )}
    <ConversationScrollButton />
  </Conversation>
);
