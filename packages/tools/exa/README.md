# @ai-registry/exa

A powerful web search tool powered by [Exa](https://exa.ai) for use with Vercel AI SDK agents and applications.

## Features

- 🔍 **Multiple Search Types**: Auto, neural, fast, and deep search modes
- 📚 **Category Filtering**: Focus on specific content types (research papers, news, GitHub, etc.)
- 🌐 **Domain Control**: Include or exclude specific domains
- 📅 **Date Filtering**: Filter by crawl date or publication date
- 📄 **Rich Content**: Get full text, highlights, and AI-generated summaries
- 🔄 **Livecrawl**: Option to fetch fresh content in real-time
- ⚡ **TypeScript First**: Full type safety and IntelliSense support

## Installation

```bash
npm install @ai-registry/exa ai zod
# or
pnpm add @ai-registry/exa ai zod
# or
yarn add @ai-registry/exa ai zod
```

## Quick Start

### Environment Setup

Set your Exa API key in your environment:

```bash
export EXA_API_KEY="your-exa-api-key"
```

Or create a `.env` file:

```env
EXA_API_KEY=your-exa-api-key
```

Get your API key at [dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys).

### Basic Usage

```typescript
import { generateText } from "ai";
import {
  createExaWebSearchTool,
  createExaWebContentsTool,
} from "@ai-registry/exa";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  prompt:
    "Find the official docs for Effect HttpClient, then fetch the page text.",
  tools: {
    webSearch: createExaWebSearchTool({ numResults: 3 }),
    webContents: createExaWebContentsTool({
      contents: { text: { maxCharacters: 6000 }, summary: true },
    }),
  },
});
```

### Search Only

```typescript
import { generateText } from "ai";
import { createExaWebSearchTool } from "@ai-registry/exa";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "What are the latest developments in AI?",
  tools: {
    webSearch: createExaWebSearchTool(),
  },
});
```

### With AI SDK v6 Agents

```typescript
import { ToolLoopAgent } from "ai";
import { createExaWebSearchTool } from "@ai-registry/exa";
import { openai } from "@ai-sdk/openai";

const researchAgent = new ToolLoopAgent({
  model: openai("gpt-4o"),
  instructions: `You are a research assistant with access to web search.
    When researching:
    1. Search for relevant information
    2. Cross-reference multiple sources
    3. Cite your sources when presenting information`,
  tools: {
    webSearch: createExaWebSearchTool({ numResults: 10 }),
  },
});

const result = await researchAgent.generate({
  prompt: "What are the key findings from recent climate change research?",
});
```

## Configuration

### Full Configuration Options

```typescript
import { createExaWebSearchTool } from "@ai-registry/exa";

const webSearch = createExaWebSearchTool({
  // API Configuration
  apiKey: "your-exa-api-key", // Defaults to process.env.EXA_API_KEY

  // Search Type
  type: "auto", // "auto" | "neural" | "fast" | "deep"

  // Category Filter
  category: "research paper", // Focus on specific content types

  // Localization
  userLocation: "US", // Two-letter ISO country code

  // Result Count
  numResults: 10, // Number of results (max: 100)

  // Domain Filtering
  includeDomains: ["arxiv.org", "github.com"],
  excludeDomains: ["pinterest.com"],

  // Date Filtering (ISO 8601 format)
  startCrawlDate: "2024-01-01",
  endCrawlDate: "2024-12-31",
  startPublishedDate: "2024-06-01",
  endPublishedDate: "2024-12-31",

  // Text Filtering
  includeText: ["machine learning"],
  excludeText: ["clickbait"],

  // Content Options
  contents: {
    text: { maxCharacters: 5000 }, // or true/false
    highlights: {
      numSentences: 3,
      highlightsPerUrl: 5,
      query: "key findings",
    },
    summary: true, // AI-generated summary
    livecrawl: "fallback", // "never" | "fallback" | "always" | "preferred"
    livecrawlTimeout: 10000,
    subpages: 3,
    subpageTarget: ["documentation", "api"],
    extras: {
      links: 5,
      imageLinks: 3,
    },
  },

  // Custom Tool Description
  toolDescription: "Search for technical documentation and code examples",
});
```

### Search Types

| Type     | Description                                                             |
| -------- | ----------------------------------------------------------------------- |
| `auto`   | Best search - intelligently combines neural and other methods (default) |
| `neural` | Embeddings-based semantic search (max 100 results)                      |
| `fast`   | Streamlined version of the search models                                |
| `deep`   | Comprehensive deep search with query expansion                          |

### Categories

- `company` - Company information and websites
- `research paper` - Academic papers and research
- `news` - News articles
- `pdf` - PDF documents
- `github` - GitHub repositories and code
- `tweet` - Tweets
- `personal site` - Personal websites and blogs
- `financial report` - Financial reports and filings
- `people` - People profiles (primarily LinkedIn)

## Tools

This package exports two AI SDK tools:

- `createExaWebSearchTool()` calls Exa `POST /search`.
- `createExaWebContentsTool()` calls Exa `POST /contents` to fetch full text/summaries for known URLs.

## Examples

### Research Papers Search

```typescript
const academicSearch = createExaWebSearchTool({
  category: "research paper",
  includeDomains: [
    "arxiv.org",
    "scholar.google.com",
    "pubmed.ncbi.nlm.nih.gov",
  ],
  type: "neural",
  numResults: 20,
  contents: {
    text: { maxCharacters: 10000 },
    highlights: true,
    summary: true,
  },
});
```

### News Search

```typescript
const newsSearch = createExaWebSearchTool({
  category: "news",
  startPublishedDate: new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString(), // Last 7 days
  type: "auto",
  numResults: 15,
  contents: {
    text: { maxCharacters: 3000 },
    highlights: { numSentences: 2, highlightsPerUrl: 3 },
  },
});
```

### Technical Documentation Search

```typescript
const docsSearch = createExaWebSearchTool({
  includeDomains: [
    "docs.python.org",
    "developer.mozilla.org",
    "docs.microsoft.com",
    "docs.aws.amazon.com",
  ],
  type: "auto",
  contents: {
    text: { maxCharacters: 8000 },
    livecrawl: "always", // Always get fresh content
  },
});
```

### GitHub Code Search

```typescript
const codeSearch = createExaWebSearchTool({
  category: "github",
  includeDomains: ["github.com"],
  type: "neural",
  contents: {
    text: { maxCharacters: 5000 },
    extras: {
      links: 10, // Get related links
    },
  },
});
```

## Response Format

The tool returns an `ExaApiResponse` object:

```typescript
interface ExaApiResponse {
  requestId?: string;
  searchType?: "neural" | "deep";
  context?: string;
  results: ExaSearchResult[];
  costDollars?: {
    total?: number;
    breakDown?: unknown;
    perRequestPrices?: Record<string, number>;
    perPagePrices?: Record<string, number>;
  };
}

interface ExaSearchResult {
  title: string;
  url: string;
  id?: string;
  publishedDate?: string;
  author?: string;
  image?: string;
  favicon?: string;
  text?: string;
  highlights?: string[];
  highlightScores?: number[];
  summary?: string;
  subpages?: ExaSearchResult[];
  extras?: {
    links?: string[];
    imageLinks?: string[];
  };
}
```

## TypeScript Support

All types are exported for use in your application:

```typescript
import type {
  ExaWebSearchConfig,
  ExaApiResponse,
  ExaSearchResult,
  ContentsOptions,
  SearchType,
  SearchCategory,
} from "@ai-registry/exa";
```

## Peer Dependencies

- `ai` (^4.0.0 || ^5.0.0 || ^6.0.0) - Vercel AI SDK

## License

MIT

## Links

- [Exa API Documentation](https://docs.exa.ai)
- [Exa Dashboard](https://dashboard.exa.ai)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
