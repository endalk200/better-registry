"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  MessageSquare,
  ArrowLeft,
  CopyIcon,
  RefreshCcwIcon,
  Zap,
  Sparkles,
  Hash,
} from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationDownload,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
  PromptInputTools,
  PromptInputBody,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { Spinner } from "@/components/ui/spinner";
import type { PlaygroundMessage, MessageMetadata } from "./types";

const MODELS = [
  { id: "gpt-4o", provider: "openai" as const, label: "GPT-4o" },
  { id: "gpt-4o-mini", provider: "openai" as const, label: "GPT-4o Mini" },
  {
    id: "anthropic/claude-sonnet-4",
    provider: "openrouter" as const,
    label: "Claude Sonnet 4",
  },
  {
    id: "google/gemini-2.0-flash",
    provider: "openrouter" as const,
    label: "Gemini 2.0 Flash",
  },
  {
    id: "meta-llama/llama-3.1-70b-instruct",
    provider: "openrouter" as const,
    label: "Llama 3.1 70B",
  },
] as const;

const DEFAULT_MODEL = MODELS[0]!;

const SUGGESTIONS = [
  "Explain how transformers work in simple terms",
  "Write a TypeScript utility type that makes all nested properties optional",
  "Compare REST vs GraphQL for a new project",
  "Generate a regex that validates email addresses",
];

const transport = new DefaultChatTransport({ api: "/api/chat" });

function TokenBadge({ metadata }: { metadata?: MessageMetadata }) {
  if (!metadata?.totalTokens) return null;
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
}

function SessionStats({ messages }: { messages: PlaygroundMessage[] }) {
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  const totalTokens = assistantMessages.reduce(
    (sum, m) => sum + ((m.metadata as MessageMetadata)?.totalTokens ?? 0),
    0,
  );
  const messageCount = messages.length;

  if (messageCount === 0) return null;

  return (
    <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
      <span className="flex items-center gap-1">
        <MessageSquare className="size-3" />
        {messageCount}
      </span>
      {totalTokens > 0 && (
        <span className="flex items-center gap-1">
          <Zap className="size-3" />
          {totalTokens.toLocaleString()} tokens
        </span>
      )}
    </div>
  );
}

export default function PlaygroundPage() {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL.id);

  const current =
    MODELS.find((m) => m.id === selectedModel) ?? DEFAULT_MODEL;

  const { messages, status, sendMessage, regenerate } =
    useChat<PlaygroundMessage>({ transport });

  const isStreaming = status === "streaming";

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;
    sendMessage(
      { text: message.text },
      { body: { model: current.id, provider: current.provider } },
    );
    setText("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(
      { text: suggestion },
      { body: { model: current.id, provider: current.provider } },
    );
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border/60 px-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Home
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-accent" />
            <span className="text-xs font-semibold tracking-tight">
              Playground
            </span>
            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-foreground/70">
              AI SDK
            </span>
          </div>
        </div>
        <SessionStats messages={messages as PlaygroundMessage[]} />
      </header>

      {/* ── Chat area ───────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col">
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
                      Test models from OpenAI and OpenRouter. No tools, no
                      agents — just the raw model.
                    </p>
                  </div>
                </div>
                <Suggestions className="max-w-lg">
                  {SUGGESTIONS.map((s) => (
                    <Suggestion
                      key={s}
                      suggestion={s}
                      onClick={handleSuggestionClick}
                    />
                  ))}
                </Suggestions>
              </ConversationEmptyState>
            ) : (
              messages.map((message, messageIndex) => {
                const meta = message.metadata as MessageMetadata | undefined;
                const isLast = messageIndex === messages.length - 1;

                return (
                  <div
                    key={message.id}
                    className="group/msg border-b border-border/40 px-4 py-6 last:border-0 sm:px-6"
                  >
                    <div className="mx-auto max-w-3xl">
                      <Message from={message.role}>
                        <MessageContent>
                          {message.parts.map((part, i) => {
                            switch (part.type) {
                              case "text":
                                return (
                                  <Fragment key={`${message.id}-${i}`}>
                                    <MessageResponse>
                                      {part.text}
                                    </MessageResponse>

                                    {message.role === "assistant" && (
                                      <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover/msg:opacity-100">
                                        <MessageActions className="mt-0!">
                                          <MessageAction
                                            tooltip="Copy"
                                            label="Copy"
                                            onClick={() =>
                                              navigator.clipboard.writeText(
                                                part.text,
                                              )
                                            }
                                          >
                                            <CopyIcon className="size-3" />
                                          </MessageAction>
                                          {isLast && (
                                            <MessageAction
                                              tooltip="Regenerate"
                                              label="Regenerate"
                                              onClick={() => regenerate()}
                                            >
                                              <RefreshCcwIcon className="size-3" />
                                            </MessageAction>
                                          )}
                                        </MessageActions>
                                        <TokenBadge metadata={meta} />
                                      </div>
                                    )}
                                  </Fragment>
                                );
                              default:
                                return null;
                            }
                          })}
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
              messages={messages.map((m) => ({
                role: m.role,
                content: m.parts
                  .filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map((p) => p.text)
                  .join("\n"),
              }))}
              className="absolute right-4 top-4"
            />
          )}
          <ConversationScrollButton />
        </Conversation>

        {/* ── Input ──────────────────────────────────────────── */}
        <div className="border-t border-border/60 bg-background px-4 py-3">
          <PromptInput
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl"
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                placeholder="Send a message..."
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputSelect
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                >
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {MODELS.map((m) => (
                      <PromptInputSelectItem key={m.id} value={m.id}>
                        {m.label}
                      </PromptInputSelectItem>
                    ))}
                  </PromptInputSelectContent>
                </PromptInputSelect>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!text.trim() && !isStreaming}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
