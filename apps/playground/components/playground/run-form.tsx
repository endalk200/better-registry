"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { AgentMetadata, RunState } from "@/lib/agent-types";
import { Play, Stop, Eraser, Lightning } from "@phosphor-icons/react";

interface RunFormProps {
  agent: AgentMetadata | null;
  runState: RunState;
  onRun: (prompt: string, context?: string) => void;
  onStop: () => void;
  onClear: () => void;
}

export function RunForm({
  agent,
  runState,
  onRun,
  onStop,
  onClear,
}: RunFormProps) {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);

  const isRunning = runState === "running";
  const canRun = agent && prompt.trim() && !isRunning;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canRun) {
      onRun(prompt.trim(), context.trim() || undefined);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setContext("");
    onClear();
  };

  if (!agent) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 rounded-sm bg-muted p-3 w-fit">
            <Lightning className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">No Agent Selected</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
            Select an agent from the sidebar to start running queries
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium">{agent.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter your query below
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">
              {agent.model}
            </Badge>
            {runState === "complete" && (
              <Badge variant="secondary" className="text-[10px]">
                Complete
              </Badge>
            )}
            {runState === "error" && (
              <Badge variant="destructive" className="text-[10px]">
                Error
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium">Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your query here..."
            className="min-h-[120px] resize-none"
            disabled={isRunning}
          />
        </div>

        {showContext ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Context (optional)</label>
              <button
                type="button"
                onClick={() => {
                  setShowContext(false);
                  setContext("");
                }}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Remove
              </button>
            </div>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Additional context for the agent..."
              className="min-h-[80px] resize-none"
              disabled={isRunning}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowContext(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            disabled={isRunning}
          >
            + Add context
          </button>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {agent.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <Button
              type="button"
              variant="destructive"
              onClick={onStop}
              className="flex-1"
            >
              <Stop className="size-3.5" data-icon="inline-start" />
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={!canRun} className="flex-1">
              <Play
                className="size-3.5"
                data-icon="inline-start"
                weight="fill"
              />
              Run Agent
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            disabled={isRunning}
            title="Clear"
          >
            <Eraser className="size-3.5" />
          </Button>
        </div>
        {isRunning && (
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Spinner className="size-3" />
            <span>Agent is running...</span>
          </div>
        )}
      </div>
    </form>
  );
}
