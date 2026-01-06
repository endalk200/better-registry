"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ToolCallInfo,
  RunFinishInfo,
  RunState,
  RunUsage,
} from "@/lib/agent-types";
import type { UIMessage } from "@ai-sdk/react";
import {
  TextT,
  Wrench,
  BracketsCurly,
  Gauge,
  CheckCircle,
  CircleNotch,
  CaretRight,
} from "@phosphor-icons/react";

interface OutputPanelsProps {
  runState: RunState;
  responseText: string;
  toolCalls: ToolCallInfo[];
  messages: UIMessage[];
  usage: RunUsage | null;
  finishInfo: RunFinishInfo | null;
  error: string | null;
}

export function OutputPanels({
  runState,
  responseText,
  toolCalls,
  messages,
  usage,
  finishInfo,
  error,
}: OutputPanelsProps) {
  const hasOutput = Boolean(
    responseText || toolCalls.length > 0 || messages.length > 0 || error
  );

  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="response" className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-border px-4">
          <TabsList variant="line" className="h-10">
            <TabsTrigger value="response" className="gap-1.5">
              <TextT className="size-3.5" />
              Response
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-1.5">
              <Wrench className="size-3.5" />
              Tool Calls
              {toolCalls.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 text-[10px] px-1.5 py-0 h-4"
                >
                  {toolCalls.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="raw" className="gap-1.5">
              <BracketsCurly className="size-3.5" />
              Raw
            </TabsTrigger>
            <TabsTrigger value="usage" className="gap-1.5">
              <Gauge className="size-3.5" />
              Usage
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="response"
          className="flex-1 min-h-0 m-0 overflow-hidden"
        >
          <ResponsePanel
            runState={runState}
            responseText={responseText}
            error={error}
            hasOutput={hasOutput}
          />
        </TabsContent>

        <TabsContent
          value="tools"
          className="flex-1 min-h-0 m-0 overflow-hidden"
        >
          <ToolCallsPanel toolCalls={toolCalls} />
        </TabsContent>

        <TabsContent value="raw" className="flex-1 min-h-0 m-0 overflow-hidden">
          <RawPanel messages={messages} />
        </TabsContent>

        <TabsContent
          value="usage"
          className="flex-1 min-h-0 m-0 overflow-hidden"
        >
          <UsagePanel
            usage={usage}
            runState={runState}
            finishInfo={finishInfo}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResponsePanel({
  runState,
  responseText,
  error,
  hasOutput,
}: {
  runState: RunState;
  responseText: string;
  error: string | null;
  hasOutput: boolean;
}) {
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-destructive/10 border border-destructive/20 p-4">
          <h4 className="text-sm font-medium text-destructive mb-1">Error</h4>
          <p className="text-xs text-destructive/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!hasOutput && runState === "idle") {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 rounded-sm bg-muted p-3 w-fit">
            <TextT className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">No Output Yet</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Run an agent to see the response here
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed">
            {responseText || (runState === "running" ? "Generating..." : "")}
          </pre>
        </div>
      </div>
    </ScrollArea>
  );
}

function ToolCallsPanel({ toolCalls }: { toolCalls: ToolCallInfo[] }) {
  if (toolCalls.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 rounded-sm bg-muted p-3 w-fit">
            <Wrench className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">No Tool Calls</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Tool invocations will appear here as the agent runs
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        {toolCalls.map((call) => (
          <ToolCallCard key={call.toolCallId} call={call} />
        ))}
      </div>
    </ScrollArea>
  );
}

function ToolCallCard({ call }: { call: ToolCallInfo }) {
  const isComplete = call.state === "result";

  return (
    <div className="border border-border overflow-hidden">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-xs",
          isComplete ? "bg-muted/50" : "bg-primary/5"
        )}
      >
        {isComplete ? (
          <CheckCircle className="size-3.5 text-primary" weight="fill" />
        ) : (
          <CircleNotch className="size-3.5 text-primary animate-spin" />
        )}
        <span className="font-mono font-medium">{call.toolName}</span>
        <Badge
          variant={isComplete ? "secondary" : "outline"}
          className="text-[10px] ml-auto"
        >
          {isComplete ? "Complete" : "Running"}
        </Badge>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
            <CaretRight className="size-3" />
            Arguments
          </div>
          <pre className="text-[11px] font-mono bg-muted/50 p-2 overflow-x-auto">
            {JSON.stringify(call.args, null, 2)}
          </pre>
        </div>

        {call.result !== undefined && (
          <div>
            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              <CaretRight className="size-3" />
              Result
            </div>
            <pre className="text-[11px] font-mono bg-muted/50 p-2 overflow-x-auto max-h-[200px]">
              {typeof call.result === "string"
                ? call.result
                : JSON.stringify(call.result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function RawPanel({ messages }: { messages: UIMessage[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 rounded-sm bg-muted p-3 w-fit">
            <BracketsCurly className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">No Messages</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Raw message data will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <pre className="text-[11px] font-mono bg-muted/30 p-3 overflow-x-auto">
          {JSON.stringify(messages, null, 2)}
        </pre>
      </div>
    </ScrollArea>
  );
}

function UsagePanel({
  usage,
  runState,
  finishInfo,
}: {
  usage: RunUsage | null;
  runState: RunState;
  finishInfo: RunFinishInfo | null;
}) {
  if (!usage && runState === "idle") {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-3 rounded-sm bg-muted p-3 w-fit">
            <Gauge className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">No Usage Data</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Token usage will appear here after a run
          </p>
        </div>
      </div>
    );
  }

  const inputTokens = usage?.inputTokens;
  const outputTokens = usage?.outputTokens;
  const totalTokens = usage?.totalTokens;

  const inputDetails = usage?.inputTokenDetails;
  const outputDetails = usage?.outputTokenDetails;

  const rawUsage = usage?.raw ?? usage;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {finishInfo?.finishReason && (
            <Badge variant="secondary" className="text-[10px]">
              finishReason: {finishInfo.finishReason}
            </Badge>
          )}
          {finishInfo?.rawFinishReason && (
            <Badge variant="secondary" className="text-[10px]">
              rawFinishReason: {finishInfo.rawFinishReason}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <UsageCard
            label="Input Tokens"
            value={inputTokens}
            description="Prompt/input tokens sent to the model"
          />
          <UsageCard
            label="Output Tokens"
            value={outputTokens}
            description="Completion/output tokens generated by the model"
          />
          <UsageCard
            label="Total Tokens"
            value={totalTokens}
            description="Combined input + output"
          />
        </div>

        {(inputDetails || outputDetails) && (
          <div className="grid grid-cols-1 gap-4">
            {inputDetails && (
              <DetailsCard title="Input Token Details" details={inputDetails} />
            )}
            {outputDetails && (
              <DetailsCard
                title="Output Token Details"
                details={outputDetails}
              />
            )}
          </div>
        )}

        <div className="border border-border p-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Raw Usage
          </p>
          <pre className="text-[11px] font-mono bg-muted/30 p-3 overflow-x-auto max-h-[320px]">
            {rawUsage ? JSON.stringify(rawUsage, null, 2) : "—"}
          </pre>
          <p className="text-[11px] text-muted-foreground mt-2">
            Note: Usage availability depends on provider/model and streaming
            mode.
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}

function DetailsCard({
  title,
  details,
}: {
  title: string;
  details: Record<string, number | undefined>;
}) {
  const entries = Object.entries(details).filter(
    ([, v]) => typeof v === "number" && Number.isFinite(v)
  );

  if (entries.length === 0) return null;

  return (
    <div className="border border-border p-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] text-muted-foreground font-mono">
              {k}
            </span>
            <span className="text-[11px] font-mono">
              {Number(v).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageCard({
  label,
  value,
  description,
}: {
  label: string;
  value?: number;
  description: string;
}) {
  return (
    <div className="border border-border p-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-mono font-medium mt-1">
        {value !== undefined ? value.toLocaleString() : "—"}
      </p>
      <p className="text-[10px] text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
