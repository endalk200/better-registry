import { fireEvent, render, screen } from "@testing-library/react";
import type { ChangeEvent, ReactNode } from "react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { PlaygroundComposer } from "@/app/playground/components/playground-composer";

vi.mock("@/components/ai-elements/prompt-input", () => ({
  PromptInput: ({
    children,
    onSubmit,
  }: {
    children: ReactNode;
    onSubmit: (message: { text: string; files: [] }) => void;
  }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ text: "from-form", files: [] });
      }}
    >
      {children}
    </form>
  ),
  PromptInputBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PromptInputFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  PromptInputTools: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PromptInputTextarea: ({
    value,
    onChange,
    ...props
  }: {
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  }) => <textarea value={value} onChange={onChange} {...props} />,
  PromptInputSelect: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PromptInputSelectTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  PromptInputSelectValue: () => <span>model</span>,
  PromptInputSelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  PromptInputSelectItem: ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
  PromptInputSubmit: ({
    disabled,
    onStop,
    status,
  }: {
    disabled?: boolean;
    onStop?: () => void;
    status?: string;
  }) => {
    const isGenerating = status === "submitted" || status === "streaming";
    return (
      <button
        aria-label={isGenerating ? "Stop" : "Submit"}
        disabled={disabled}
        onClick={() => {
          if (isGenerating) {
            onStop?.();
          }
        }}
        type="button"
      >
        send
      </button>
    );
  },
}));

describe("PlaygroundComposer", () => {
  it("disables submit when idle and input is empty", () => {
    render(
      <PlaygroundComposer
        text=""
        status="ready"
        selectedModel="gpt-4o"
        onTextChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={vi.fn()}
        onSelectedModelChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("keeps stop enabled while streaming and calls stop", () => {
    const onStop = vi.fn();

    render(
      <PlaygroundComposer
        text=""
        status="streaming"
        selectedModel="gpt-4o"
        onTextChange={vi.fn()}
        onSubmit={vi.fn()}
        onStop={onStop}
        onSelectedModelChange={vi.fn()}
      />
    );

    const stopButton = screen.getByRole("button", { name: "Stop" });
    expect(stopButton).toBeEnabled();

    fireEvent.click(stopButton);
    expect(onStop).toHaveBeenCalledTimes(1);
  });
});
