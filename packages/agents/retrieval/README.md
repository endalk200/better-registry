# @ai-registry/retrieval-agent

A configurable retrieval agent for Vercel AI SDK v6 with powerful web search capabilities powered by Exa.

## Features

- 🤖 **AI SDK v6 Native**: Built on `ToolLoopAgent` for seamless integration
- 🔍 **Powerful Web Search**: Integrated Exa-powered search with full configuration
- 📋 **Pre-built Presets**: Ready-to-use configurations for research, academic, news, and technical use cases
- 📊 **Multiple Output Formats**: Text, Markdown, or structured JSON output
- 🔧 **Highly Configurable**: Customize instructions, tools, search behavior, and more
- 📝 **TypeScript First**: Full type safety and IntelliSense support

## Installation

```bash
npm install @ai-registry/retrieval-agent ai @ai-sdk/openai
# or
pnpm add @ai-registry/retrieval-agent ai @ai-sdk/openai
# or
yarn add @ai-registry/retrieval-agent ai @ai-sdk/openai
```

## Quick Start

### Environment Setup

Set your API keys:

```bash
export EXA_API_KEY="your-exa-api-key"
export OPENAI_API_KEY="your-openai-api-key"
```

### Basic Usage

```typescript
import { createRetrievalAgent } from "@ai-registry/retrieval-agent";
import { openai } from "@ai-sdk/openai";

const agent = createRetrievalAgent({
  model: openai("gpt-4o"),
});

// Generate a response
const result = await agent.generate({
  prompt: "What are the latest developments in quantum computing?",
});

console.log(result.text);
```

### Streaming Response

```typescript
const stream = agent.stream({
  prompt: "Explain the current state of renewable energy adoption",
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

## Pre-built Presets

Use pre-configured agents for common use cases:

### Research Agent

General-purpose research with comprehensive sources:

```typescript
import { RetrievalAgentPresets } from "@ai-registry/retrieval-agent";
import { openai } from "@ai-sdk/openai";

const agent = RetrievalAgentPresets.research(openai("gpt-4o"));

const result = await agent.generate({
  prompt: "What are the health benefits of intermittent fasting?",
});
```

### Academic Agent

Focused on peer-reviewed sources and scientific publications:

```typescript
const agent = RetrievalAgentPresets.academic(openai("gpt-4o"));

const result = await agent.generate({
  prompt: "What does recent research say about the gut-brain connection?",
});

// Returns structured output with sources and confidence level
console.log(result.output);
```

### News Agent

Current events from reputable news sources:

```typescript
const agent = RetrievalAgentPresets.news(openai("gpt-4o"));

const result = await agent.generate({
  prompt: "What are the major tech industry developments this week?",
});
```

### Technical Agent

Documentation and technical specifications:

```typescript
const agent = RetrievalAgentPresets.technical(openai("gpt-4o"));

const result = await agent.generate({
  prompt: "How do I implement authentication in Next.js 14 with NextAuth?",
});
```

## Configuration

### Full Configuration Options

```typescript
import { createRetrievalAgent } from "@ai-registry/retrieval-agent";
import { openai } from "@ai-sdk/openai";

const agent = createRetrievalAgent({
  // Required: The language model
  model: openai("gpt-4o"),

  // Custom instructions (appended to defaults)
  instructions: "Focus on sources from the last 6 months",

  // Use only custom instructions (disable defaults)
  useDefaultInstructions: false,

  // Web search configuration
  webSearch: {
    enabled: true, // Can disable web search
    apiKey: "your-exa-api-key", // Defaults to EXA_API_KEY env var
    numResults: 10,
    type: "neural", // "auto" | "keyword" | "neural" | "fast" | "deep"
    category: "research paper",
    includeDomains: ["arxiv.org", "nature.com"],
    excludeDomains: ["pinterest.com"],
    startPublishedDate: "2024-01-01",
    contents: {
      text: { maxCharacters: 5000 },
      highlights: true,
      summary: true,
    },
  },

  // Additional tools
  additionalTools: {
    // Add custom tools here
  },

  // Stop conditions
  stopCondition: {
    maxSteps: 10, // Maximum tool calls + generations
  },

  // Tool choice
  toolChoice: "auto", // "auto" | "none" | "required"

  // Output format
  outputFormat: "markdown", // "text" | "markdown" | "structured"

  // Model parameters
  temperature: 0.3, // 0-2, lower = more focused
  maxOutputTokens: 4000,
});
```

### Web Search Configuration

The agent uses `@ai-registry/exa-websearch` under the hood. All Exa search options are available:

```typescript
const agent = createRetrievalAgent({
  model: openai("gpt-4o"),
  webSearch: {
    // Search type
    type: "neural", // Deep semantic search

    // Category filter
    category: "research paper",

    // Domain filtering
    includeDomains: ["arxiv.org", "github.com"],
    excludeDomains: ["pinterest.com"],

    // Date filters (ISO 8601)
    startPublishedDate: "2024-01-01",
    endPublishedDate: "2024-12-31",

    // Content options
    contents: {
      text: { maxCharacters: 8000 },
      highlights: {
        numSentences: 5,
        highlightsPerUrl: 3,
      },
      summary: true,
      livecrawl: "fallback",
    },
  },
});
```

### Output Formats

#### Text Output

```typescript
const agent = createRetrievalAgent({
  model: openai("gpt-4o"),
  outputFormat: "text",
});

const { text } = await agent.generate({ prompt: "..." });
```

#### Markdown Output (Default)

```typescript
const agent = createRetrievalAgent({
  model: openai("gpt-4o"),
  outputFormat: "markdown",
});

const { text } = await agent.generate({ prompt: "..." });
// Returns formatted markdown with headers, links, etc.
```

#### Structured Output

```typescript
const agent = createRetrievalAgent({
  model: openai("gpt-4o"),
  outputFormat: "structured",
});

const { output } = await agent.generate({ prompt: "..." });

// output is typed as:
// {
//   answer: string;
//   keyPoints: string[];
//   sources: Array<{ title: string; url: string; relevance?: string }>;
//   confidence: "high" | "medium" | "low";
//   caveats?: string[];
// }
```

### Adding Custom Tools

```typescript
import { createRetrievalAgent } from "@ai-registry/retrieval-agent";
import { tool } from "ai";
import { z } from "zod";

const agent = createRetrievalAgent({
  model: openai("gpt-4o"),
  additionalTools: {
    calculator: tool({
      description: "Perform mathematical calculations",
      parameters: z.object({
        expression: z.string().describe("Math expression to evaluate"),
      }),
      execute: async ({ expression }) => {
        // Safe evaluation logic here
        return { result: eval(expression) };
      },
    }),
    dateInfo: tool({
      description: "Get current date and time information",
      parameters: z.object({}),
      execute: async () => ({
        date: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    }),
  },
});
```

## API Routes

### Next.js App Router

```typescript
// app/api/research/route.ts
import { createRetrievalAgent } from "@ai-registry/retrieval-agent";
import { createAgentUIStreamResponse } from "ai";
import { openai } from "@ai-sdk/openai";

const agent = createRetrievalAgent({
  model: openai("gpt-4o"),
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent,
    messages,
  });
}
```

### Client Component

```tsx
// components/ResearchChat.tsx
"use client";

import { useChat } from "@ai-sdk/react";

export function ResearchChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/research",
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong>
          <div>{m.content}</div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Research</button>
      </form>
    </div>
  );
}
```

## Customizing Presets

Presets accept an optional second argument to override defaults:

```typescript
const agent = RetrievalAgentPresets.academic(openai("gpt-4o"), {
  temperature: 0.1,
  stopCondition: { maxSteps: 15 },
  webSearch: {
    numResults: 20,
    includeDomains: ["arxiv.org", "pubmed.ncbi.nlm.nih.gov"],
  },
});
```

## TypeScript Support

All types are exported:

```typescript
import type {
  RetrievalAgentConfig,
  RetrievalGenerateOptions,
  RetrievalStreamOptions,
  RetrievalStructuredOutput,
  RetrievalWebSearchConfig,
  RetrievalOutputFormat,
} from "@ai-registry/retrieval-agent";
```

## Dependencies

### Peer Dependencies

- `ai` (^6.0.0) - Vercel AI SDK v6

### Included Dependencies

- `@ai-registry/exa-websearch` - Exa-powered web search tool
- `zod` - Schema validation

## License

MIT

## Links

- [Vercel AI SDK v6 Documentation](https://sdk.vercel.ai/docs)
- [Exa API Documentation](https://docs.exa.ai)
- [@ai-registry/exa-websearch](../tools/exa-websearch)
