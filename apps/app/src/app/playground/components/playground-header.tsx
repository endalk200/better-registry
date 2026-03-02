"use client";

import Link from "next/link";
import React from "react";
import { ArrowLeft, MessageSquare, Sparkles, Zap } from "lucide-react";
import type { PlaygroundMessage } from "@/lib/playground/chat-contract";

const SessionStats = ({ messages }: { messages: PlaygroundMessage[] }) => {
  const assistantMessages = messages.filter((message) => message.role === "assistant");
  const totalTokens = assistantMessages.reduce((sum, message) => {
    const total = typeof message.metadata?.totalTokens === "number"
      ? message.metadata.totalTokens
      : 0;
    return sum + total;
  }, 0);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
      <span className="flex items-center gap-1">
        <MessageSquare className="size-3" />
        {messages.length}
      </span>
      {totalTokens > 0 && (
        <span className="flex items-center gap-1">
          <Zap className="size-3" />
          {totalTokens.toLocaleString()} tokens
        </span>
      )}
    </div>
  );
};

export const PlaygroundHeader = ({ messages }: { messages: PlaygroundMessage[] }) => (
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
        <span className="text-xs font-semibold tracking-tight">Playground</span>
        <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-foreground/70">
          AI SDK
        </span>
      </div>
    </div>
    <SessionStats messages={messages} />
  </header>
);
