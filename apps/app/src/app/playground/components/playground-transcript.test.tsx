import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { PlaygroundTranscript } from "@/app/playground/components/playground-transcript";

vi.mock("@/components/ai-elements/conversation", () => ({
  Conversation: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ConversationContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ConversationEmptyState: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ConversationDownload: () => <button type="button">download</button>,
  ConversationScrollButton: () => <button type="button">scroll</button>,
}));

vi.mock("@/components/ai-elements/message", () => ({
  Message: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MessageContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MessageResponse: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MessageActions: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  MessageAction: ({
    children,
    label,
    onClick,
    disabled,
  }: {
    children: ReactNode;
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ai-elements/suggestion", () => ({
  Suggestions: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Suggestion: ({
    suggestion,
    onClick,
  }: {
    suggestion: string;
    onClick?: (value: string) => void;
  }) => (
    <button onClick={() => onClick?.(suggestion)} type="button">
      {suggestion}
    </button>
  ),
}));

vi.mock("@/components/ui/spinner", () => ({
  Spinner: () => <span>spinner</span>,
}));

describe("PlaygroundTranscript", () => {
  it("sends suggestion text when suggestion is clicked", () => {
    const onSuggestionClick = vi.fn();

    render(
      <PlaygroundTranscript
        messages={[]}
        status="ready"
        canRegenerate={false}
        onRegenerate={vi.fn()}
        onSuggestionClick={onSuggestionClick}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Explain how transformers work in simple terms",
      })
    );

    expect(onSuggestionClick).toHaveBeenCalledWith(
      "Explain how transformers work in simple terms"
    );
  });

  it("triggers regenerate from assistant message action", () => {
    const onRegenerate = vi.fn();

    render(
      <PlaygroundTranscript
        messages={[
          {
            id: "assistant-1",
            role: "assistant",
            parts: [{ type: "text", text: "response" }],
            metadata: { totalTokens: 50 },
          },
        ]}
        status="ready"
        canRegenerate
        onRegenerate={onRegenerate}
        onSuggestionClick={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Regenerate" }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });
});
