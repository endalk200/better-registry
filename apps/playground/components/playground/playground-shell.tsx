"use client";

import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { AgentSelector } from "./agent-selector";
import { RunForm } from "./run-form";
import { OutputPanels } from "./output-panels";
import { useAgentRunner } from "@/hooks/use-agent-runner";
import type { AgentMetadata } from "@/lib/agent-types";
import { Spinner } from "@/components/ui/spinner";

export function PlaygroundShell() {
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentMetadata | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    runState,
    messages,
    error,
    responseText,
    toolCalls,
    usage,
    finishInfo,
    runAgent,
    stopRun,
    clearRun,
  } = useAgentRunner({ agent: selectedAgent });

  // Load agents from API on mount
  useEffect(() => {
    async function loadAgents() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const response = await fetch("/api/playground/agents");
        if (!response.ok) {
          throw new Error("Failed to load agents");
        }
        const data = await response.json();
        setAgents(data);
        // Auto-select the first agent if available
        if (data.length > 0) {
          setSelectedAgent(data[0]);
        }
      } catch (err) {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load agents"
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadAgents();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAgent = (agent: AgentMetadata) => {
    if (agent.id !== selectedAgent?.id) {
      clearRun();
      setSelectedAgent(agent);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          <span>Loading agents...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-sm font-medium text-destructive">
            Failed to Load Agents
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-primary mt-3 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full"
      defaultLayout={{ agents: 20, form: 30, output: 50 }}
    >
      {/* Left Panel - Agent Selector */}
      <ResizablePanel id="agents" minSize="15%" maxSize="30%">
        <div className="h-full border-r border-border overflow-hidden">
          <AgentSelector
            agents={agents}
            selectedAgent={selectedAgent}
            onSelectAgent={handleSelectAgent}
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Middle Panel - Run Form */}
      <ResizablePanel id="form" minSize="20%" maxSize="45%">
        <div className="h-full border-r border-border overflow-hidden">
          <RunForm
            agent={selectedAgent}
            runState={runState}
            onRun={runAgent}
            onStop={stopRun}
            onClear={clearRun}
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel - Output */}
      <ResizablePanel id="output" minSize="25%">
        <div className="h-full overflow-hidden">
          <OutputPanels
            runState={runState}
            responseText={responseText}
            toolCalls={toolCalls}
            messages={messages}
            usage={usage}
            finishInfo={finishInfo}
            error={error}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
