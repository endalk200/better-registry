"use client";

import { PlaygroundComposer } from "@/app/playground/components/playground-composer";
import { PlaygroundHeader } from "@/app/playground/components/playground-header";
import { PlaygroundTranscript } from "@/app/playground/components/playground-transcript";
import { usePlaygroundChat } from "@/app/playground/hooks/use-playground-chat";

export default function PlaygroundPage() {
  const {
    canRegenerate,
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
  } = usePlaygroundChat();

  return (
    <div className="flex h-dvh flex-col bg-background">
      <PlaygroundHeader messages={messages} />

      <div className="flex min-h-0 flex-1 flex-col">
        <PlaygroundTranscript
          messages={messages}
          status={status}
          canRegenerate={canRegenerate}
          onRegenerate={regenerateLast}
          onSuggestionClick={sendSuggestion}
        />
        <PlaygroundComposer
          text={text}
          status={status}
          selectedModel={selectedModel}
          onTextChange={setText}
          onSubmit={submit}
          onStop={stop}
          onSelectedModelChange={setSelectedModel}
        />
      </div>
    </div>
  );
}
