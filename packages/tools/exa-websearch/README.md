# @ai-registry/exa-websearch

A powerful web search tool powered by [Exa](https://exa.ai) for use with Vercel AI SDK agents and applications.

## Features

- 🔍 **Multiple Search Types**: Auto, keyword, neural, fast, and deep search modes
- 📚 **Category Filtering**: Focus on specific content types (research papers, news, GitHub, etc.)
- 🌐 **Domain Control**: Include or exclude specific domains
- 📅 **Date Filtering**: Filter by crawl date or publication date
- 📄 **Rich Content**: Get full text, highlights, and AI-generated summaries
- 🔄 **Livecrawl**: Option to fetch fresh content in real-time
- ⚡ **TypeScript First**: Full type safety and IntelliSense support

## Installation

```bash
npm install @ai-registry/exa-websearch ai zod
# or
pnpm add @ai-registry/exa-websearch ai zod
# or
yarn add @ai-registry/exa-websearch ai zod
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
import { exaWebSearch } from "@ai-registry/exa-websearch";
import { openai } from "@ai-sdk/openai";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "What are the latest developments in AI?",
  tools: {
    webSearch: exaWebSearch(),
  },
});
```

### With AI SDK v6 Agents

```typescript
import { ToolLoopAgent } from "ai";
import { exaWebSearch } from "@ai-registry/exa-websearch";
import { openai } from "@ai-sdk/openai";

const researchAgent = new ToolLoopAgent({
  model: openai("gpt-4o"),
  instructions: `You are a research assistant with access to web search.
    When researching:
    1. Search for relevant information
    2. Cross-reference multiple sources
    3. Cite your sources when presenting information`,
  tools: {
    webSearch: exaWebSearch({ numResults: 10 }),
  },
});

const result = await researchAgent.generate({
  prompt: "What are the key findings from recent climate change research?",
});
```

## Configuration

### Full Configuration Options

```typescript
import { exaWebSearch } from "@ai-registry/exa-websearch";

const webSearch = exaWebSearch({
  // API Configuration
  apiKey: "your-exa-api-key", // Defaults to process.env.EXA_API_KEY

  // Search Type
  type: "auto", // "auto" | "keyword" | "neural" | "fast" | "deep"

  // Category Filter
  category: "research paper", // Focus on specific content types

  // Localization
  userLocation: "US", // Two-letter ISO country code

  // Result Count
  numResults: 10, // Number of results (keyword max: 10, neural max: 100)

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

| Type      | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `auto`    | Best search - intelligently combines keyword and neural (default) |
| `keyword` | Fast keyword search (max 10 results)                              |
| `neural`  | Deep semantic search (max 100 results)                            |
| `fast`    | Streamlined versions of neural and keyword                        |
| `deep`    | Comprehensive deep search with enhanced analysis                  |

### Categories

- `company` - Company information and websites
- `research paper` - Academic papers and research
- `news` - News articles
- `pdf` - PDF documents
- `github` - GitHub repositories and code
- `personal site` - Personal websites and blogs
- `linkedin profile` - LinkedIn profiles
- `financial report` - Financial reports and filings

## Examples

### Research Papers Search

```typescript
const academicSearch = exaWebSearch({
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
const newsSearch = exaWebSearch({
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
const docsSearch = exaWebSearch({
  includeDomains: [
    "docs.python.org",
    "developer.mozilla.org",
    "docs.microsoft.com",
    "docs.aws.amazon.com",
  ],
  type: "keyword",
  contents: {
    text: { maxCharacters: 8000 },
    livecrawl: "always", // Always get fresh content
  },
});
```

### GitHub Code Search

```typescript
const codeSearch = exaWebSearch({
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
  resolvedSearchType?: "neural" | "keyword" | "fast" | "deep";
  results: ExaSearchResult[];
  searchTime?: number;
  costDollars?: {
    total?: number;
    search?: Record<string, number>;
    contents?: Record<string, number>;
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
} from "@ai-registry/exa-websearch";
```

## Peer Dependencies

- `ai` (^4.0.0 || ^5.0.0 || ^6.0.0) - Vercel AI SDK

## License

MIT

## Links

- [Exa API Documentation](https://docs.exa.ai)
- [Exa Dashboard](https://dashboard.exa.ai)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
