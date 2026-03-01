import type { RegistryItem } from "../types";

export const exaSearch: RegistryItem = {
  slug: "exa-search",
  name: "exa-search",
  packageName: "@ai-registry/exa",
  type: "tool",
  status: "available",
  description:
    "Neural and keyword web search powered by Exa. Includes content scraping, highlights, and summaries.",
  longDescription: `Exa Search gives your AI agents the ability to search the web using neural, keyword, or deep search modes. Unlike traditional search APIs, Exa understands meaning — not just keywords — returning highly relevant results with optional full-text content, highlights, and AI-generated summaries.

The tool ships with a framework-agnostic core and ready-made adapters for both Vercel AI SDK and TanStack AI, so you can plug it into any agent architecture. All configuration is type-safe with Zod schemas, and errors are structured using Effect for predictable handling.`,
  icon: "search",
  tags: ["web-search", "neural", "scraping", "rag"],
  installCommand: "npx better-registry add exa-search",
  sdkSupport: ["ai-sdk", "tanstack-ai"],
  version: "0.1.0",
  features: [
    "Neural, keyword, fast, and deep search modes",
    "Full-text content extraction with configurable character limits",
    "AI-powered highlights and summaries per result",
    "Domain include/exclude filters",
    "Date range filtering (crawl date and publish date)",
    "Category-scoped search (news, research papers, GitHub, tweets, etc.)",
    "Livecrawl support for fresh content",
    "Subpage crawling for deeper content extraction",
    "Structured error handling with Effect",
    "Type-safe configuration with Zod schemas",
  ],
  quickStart: [
    {
      title: "AI SDK — Web Search Tool",
      language: "typescript",
      filename: "search-agent.ts",
      sdk: "ai-sdk",
      code: `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createExaWebSearchTool } from "@/tools/exa";

const { text } = await generateText({
  model: openai("gpt-4o"),
  tools: {
    webSearch: createExaWebSearchTool({
      numResults: 5,
      type: "neural",
      contents: { text: true, highlights: true },
    }),
  },
  maxSteps: 3,
  prompt: "Find the latest papers on multi-agent systems",
});`,
    },
    {
      title: "TanStack AI — Web Search Tool",
      language: "typescript",
      filename: "tanstack-search.ts",
      sdk: "tanstack-ai",
      code: `import { createTanstackExaWebSearchTool } from "@/tools/exa/tanstack-ai";

const searchTool = createTanstackExaWebSearchTool({
  numResults: 10,
  type: "auto",
  category: "research paper",
  contents: {
    text: { maxCharacters: 5000 },
    summary: true,
  },
});

// Use with your TanStack AI agent
const agent = createAgent({
  tools: [searchTool],
});`,
    },
    {
      title: "Core — Direct API Call",
      language: "typescript",
      filename: "core-search.ts",
      sdk: "core",
      code: `import { webSearch } from "@/tools/exa/core";

const results = await webSearch(
  { query: "latest AI research 2025" },
  {
    type: "neural",
    numResults: 10,
    category: "research paper",
    contents: {
      text: { maxCharacters: 3000 },
      highlights: { numSentences: 3 },
      summary: true,
    },
  },
);

for (const result of results.results) {
  console.log(result.title, result.url);
  console.log(result.summary);
}`,
    },
  ],
  apiReference: [
    {
      name: "createExaWebSearchTool",
      type: "(config?, toolOptions?) => Tool",
      required: false,
      description:
        "Creates an AI SDK tool for web search. Returns a tool with a { query: string } input schema.",
    },
    {
      name: "createExaWebContentsTool",
      type: "(config?, toolOptions?) => Tool",
      required: false,
      description:
        "Creates an AI SDK tool for fetching page contents. Returns a tool with a { urls: string[] } input schema.",
    },
    {
      name: "createTanstackExaWebSearchTool",
      type: "(config?, toolOptions?) => ServerTool",
      required: false,
      description:
        "Creates a TanStack AI server tool for web search with the same config options as the AI SDK variant.",
    },
    {
      name: "createTanstackExaWebContentsTool",
      type: "(config?, toolOptions?) => ServerTool",
      required: false,
      description:
        "Creates a TanStack AI server tool for contents fetching with the same config options as the AI SDK variant.",
    },
    {
      name: "webSearch",
      type: "(input, options?) => Promise<ExaApiResponse>",
      required: false,
      description:
        "Core function for direct web search. Framework-agnostic, returns raw Exa API response.",
    },
    {
      name: "webContents",
      type: "(input, options?) => Promise<ExaContentsResponse>",
      required: false,
      description:
        "Core function for fetching page contents by URL. Framework-agnostic, returns raw Exa contents response.",
    },
  ],
  configuration: [
    {
      name: "apiKey",
      type: "string",
      default: "process.env.EXA_API_KEY",
      description: "Your Exa API key. Falls back to the EXA_API_KEY environment variable.",
    },
    {
      name: "type",
      type: '"auto" | "neural" | "fast" | "deep"',
      default: '"auto"',
      description:
        "Search mode. Neural understands meaning, fast uses keywords, deep combines multiple queries.",
    },
    {
      name: "numResults",
      type: "number",
      default: "10",
      description: "Number of results to return. Max 10 for keyword, 100 for neural.",
    },
    {
      name: "category",
      type: "SearchCategory",
      description:
        'Scope to a category: "company", "research paper", "news", "pdf", "github", "tweet", "personal site", "financial report", "people".',
    },
    {
      name: "includeDomains",
      type: "string[]",
      description: "Only return results from these domains.",
    },
    {
      name: "excludeDomains",
      type: "string[]",
      description: "Exclude results from these domains.",
    },
    {
      name: "contents.text",
      type: "boolean | { maxCharacters?: number }",
      default: "{ maxCharacters: 3000 }",
      description: "Extract full page text. Set maxCharacters to limit length.",
    },
    {
      name: "contents.highlights",
      type: "boolean | { numSentences?: number }",
      default: "false",
      description: "Extract relevant highlights/snippets from each result.",
    },
    {
      name: "contents.summary",
      type: "boolean | { query?: string }",
      default: "false",
      description: "Generate an AI summary for each result.",
    },
    {
      name: "contents.livecrawl",
      type: '"never" | "fallback" | "always" | "preferred"',
      default: '"fallback"',
      description: "When to fetch fresh content via livecrawl instead of cache.",
    },
    {
      name: "timeoutMs",
      type: "number",
      default: "15000",
      description: "Request timeout in milliseconds.",
    },
  ],
};
