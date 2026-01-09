# AI Registry Playground

A generic playground for testing and running AI agents and tools from the ai-registry.

## Features

- **Agent Selection**: Browse and select from available agents in the registry
- **Run Form**: Enter prompts and optional context for agent execution
- **Streaming Output**: Watch agent responses stream in real-time
- **Tool Call Visibility**: See tool invocations and their results as the agent works
- **Raw Trace**: Inspect the full message history in JSON format
- **Usage Metrics**: View token usage statistics (when available)

## Getting Started

### 1. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy the example env file and fill in your API keys:

```bash
cd apps/playground
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:

```env
OPENAI_API_KEY=sk-your-openai-api-key
EXA_API_KEY=your-exa-api-key
```

### 3. Build the Agent Packages

```bash
# From monorepo root
pnpm build
```

### 4. Start the Development Server

```bash
# From monorepo root
pnpm dev --filter=@ai-registry/playground

# Or from this directory
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to access the playground.

## Adding New Agents

Agents are defined in the [`playground.agents.ts`](./playground.agents.ts) file. To add a new agent:

### 1. Import Your Agent

```typescript
import { myAgent } from "@ai-registry/my-agent";
```

### 2. Add an Entry to the Registry

```typescript
export const agentRegistry: AgentDefinition[] = [
  // ... existing agents

  {
    id: "my-agent.variant",
    name: "My Agent",
    description: "Description of what this agent does",
    category: "MyCategory",
    model: "gpt-4o",
    tags: ["tag1", "tag2"],
    inputSchema: agentInputSchema, // or extend with custom fields
    createAgent: () => createMyAgent({ model: openai("gpt-4o") }),
  },
];
```

### Agent Definition Fields

| Field         | Type                  | Description                                      |
| ------------- | --------------------- | ------------------------------------------------ |
| `id`          | `string`              | Unique identifier (e.g., "retrieval.research")   |
| `name`        | `string`              | Display name shown in the UI                     |
| `description` | `string`              | Brief description of the agent's purpose         |
| `category`    | `string`              | Group for organizing agents in the sidebar       |
| `model`       | `string`              | Model name for display (e.g., "gpt-4o")          |
| `tags`        | `string[]`            | Tags for filtering and display                   |
| `inputSchema` | `ZodSchema`           | Zod schema for the run form inputs               |
| `createAgent` | `() => ToolLoopAgent` | Factory function that returns a configured agent |

### Custom Input Schemas

The default `agentInputSchema` provides `prompt` and `context` fields. To add custom inputs:

```typescript
import { z } from "zod";

const customInputSchema = agentInputSchema.extend({
  temperature: z
    .number()
    .min(0)
    .max(2)
    .default(0.7)
    .describe("Model temperature"),
  maxSteps: z
    .number()
    .min(1)
    .max(20)
    .default(5)
    .describe("Maximum agent steps"),
});
```

## Architecture

```
apps/playground/
├── app/
│   ├── api/
│   │   └── playground/
│   │       └── agents/
│   │           ├── route.ts          # GET: List agents
│   │           └── [agentId]/
│   │               └── route.ts      # POST: Run agent (streaming)
│   ├── layout.tsx
│   └── page.tsx                      # Main playground page
├── components/
│   ├── playground/
│   │   ├── agent-selector.tsx        # Agent list sidebar
│   │   ├── run-form.tsx              # Input form
│   │   ├── output-panels.tsx         # Response/Tools/Raw/Usage tabs
│   │   └── playground-shell.tsx      # Main layout
│   └── ui/                           # Shared UI components
├── hooks/
│   └── use-agent-runner.ts           # Agent execution hook
├── lib/
│   ├── agent-types.ts                # Client-side types
│   └── utils.ts
└── playground.agents.ts              # Agent registry (server-only)
```

## Available Agents

### Retrieval Agents

| Agent                         | Description                                         | Output          |
| ----------------------------- | --------------------------------------------------- | --------------- |
| Research Agent                | General-purpose research with comprehensive sources | Markdown        |
| Academic Research Agent       | Peer-reviewed sources and scientific publications   | Structured JSON |
| News Agent                    | Current events from the last 7 days                 | Markdown        |
| Technical Documentation Agent | Official docs, GitHub, Stack Overflow               | Markdown        |
| Custom Retrieval Agent        | Basic retrieval with default settings               | Markdown        |

## Development

### Running Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm check-types
```

### Linting

```bash
pnpm lint
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI SDK**: Vercel AI SDK v6
- **UI Components**: Base UI + Radix Primitives
- **Styling**: Tailwind CSS 4
- **Icons**: Phosphor Icons
