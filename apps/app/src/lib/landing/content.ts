import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code,
  Globe,
  Layers,
  Mail,
  Monitor,
  Package,
  Puzzle,
  Search,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";

export interface LandingNavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const landingNavLinks: LandingNavLink[] = [
  { label: "Tools", href: "#tools" },
  { label: "Agents", href: "#agents" },
  { label: "Playground", href: "/playground" },
  { label: "Docs", href: "#docs" },
  { label: "GitHub", href: "https://github.com", external: true },
];

export const landingHeroInstallCommand = "npx better-registry add exa-search";

export const landingHeroHeadlineWords = [{ text: "The" }, { text: "shadcn" }] as const;

export const landingHeroAccentWords = [{ text: "for" }, { text: "AI." }] as const;

export const landingHeroTerminalLines = [
  {
    type: "command" as const,
    text: "npx better-registry add exa-search",
    delay: 0.6,
  },
  {
    type: "output" as const,
    text: "✓ Installing @ai-registry/exa...",
    delay: 1.2,
  },
  {
    type: "output" as const,
    text: "✓ Adding core/exa-web-search.ts",
    delay: 1.6,
  },
  { type: "output" as const, text: "✓ Adding adapters/ai-sdk.ts", delay: 1.9 },
  {
    type: "output" as const,
    text: "✓ Adding adapters/tanstack-ai.ts",
    delay: 2.2,
  },
  { type: "success" as const, text: "Done. Tool ready to use.", delay: 2.6 },
];

export const landingHeroCodePreview = `import { createExaWebSearchTool } from "@/tools/exa";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: {
    webSearch: createExaWebSearchTool(),
  },
  prompt: "Latest AI research papers",
});`;

export interface LandingHowItWorksStep {
  number: string;
  title: string;
  icon: LucideIcon;
  code: string;
  description: string;
}

export const landingHowItWorksSteps: LandingHowItWorksStep[] = [
  {
    number: "01",
    title: "Install the CLI",
    icon: Terminal,
    code: "npx better-registry init",
    description:
      "Initialize your project configuration. Detects your AI SDK and sets up imports.",
  },
  {
    number: "02",
    title: "Add a tool",
    icon: Package,
    code: "npx better-registry add exa-search",
    description:
      "Browse the registry and add any tool. Source code is copied directly into your project - you own it.",
  },
  {
    number: "03",
    title: "Build with it",
    icon: Zap,
    code: 'import { createExaWebSearchTool } from "./tools/exa";',
    description:
      "Import and use. Works with your existing AI SDK setup. Customize anything - it's your code now.",
  },
];

export interface LandingFeature {
  icon: LucideIcon;
  iconBg: string;
  title: string;
  body: string;
  large?: boolean;
  tilt?: -1 | 1;
}

export const landingFeatures: LandingFeature[] = [
  {
    icon: Layers,
    iconBg: "bg-accent",
    title: "SDK-Agnostic Architecture",
    body: "Pure logic core with adapter layers. Write tools once, use them with Vercel AI SDK, TanStack AI, or any future framework. No lock-in, ever.",
    large: true,
    tilt: -1,
  },
  {
    icon: Code,
    iconBg: "bg-gray-50",
    title: "You Own the Code",
    body: "Like shadcn, tools are copied into your project. Read it, modify it, extend it. No black boxes, no hidden API calls.",
  },
  {
    icon: Terminal,
    iconBg: "bg-gray-50",
    title: "One Command Install",
    body: "npx better-registry add [tool]. That's it. No config files, no build steps, no dependency hell.",
  },
  {
    icon: Shield,
    iconBg: "bg-gray-50",
    title: "Fully Type-Safe",
    body: "Zod schemas, TypeScript-first. Every tool input and output is validated and typed. Your IDE knows everything.",
  },
  {
    icon: Puzzle,
    iconBg: "bg-gray-50",
    title: "Composable & Extensible",
    body: "Tools are modular building blocks. Compose them into agents, chain them together, or use them standalone.",
  },
  {
    icon: Zap,
    iconBg: "bg-accent",
    title: "Battle-Tested",
    body: "Error handling, timeouts, retries, input validation. Production-grade from day one. Built with Effect for robust error handling.",
    tilt: 1,
  },
];

export type LandingCodeTab = "core" | "ai-sdk" | "tanstack";

export const landingCodeShowcaseTabs: { id: LandingCodeTab; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "ai-sdk", label: "AI SDK" },
  { id: "tanstack", label: "TanStack" },
];

export const landingCodeShowcaseDescriptions: Record<LandingCodeTab, string> = {
  core: "Start with the core. Zero dependencies, zero framework opinions. Just a typed async function that calls Exa's API. Use it in any JavaScript runtime - Node, Deno, Bun, edge functions.",
  "ai-sdk":
    "Drop it into generateText or streamText. The adapter wraps the core function with Zod schemas and tool() from the AI SDK. Fully compatible with agents, tool loops, and streaming.",
  tanstack:
    "First-class TanStack AI support. Uses toolDefinition() with full input/output Zod schemas. Works with chat(), streaming, and TanStack's server tool pattern.",
};

export const landingCodeShowcaseSnippets: Record<
  LandingCodeTab,
  { code: string; filename: string }
> = {
  core: {
    filename: "core.ts",
    code: `import { webSearch } from "@ai-registry/exa/core";

const results = await webSearch(
  { query: "latest AI research" },
  { numResults: 5, type: "neural" }
);

console.log(results.results[0].title);`,
  },
  "ai-sdk": {
    filename: "ai-sdk.ts",
    code: `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createExaWebSearchTool } from "@ai-registry/exa";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  prompt: "What are the latest developments in AI?",
  tools: {
    webSearch: createExaWebSearchTool(),
  },
});`,
  },
  tanstack: {
    filename: "tanstack-ai.ts",
    code: `import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import {
  createTanstackExaWebSearchTool
} from "@ai-registry/exa/tanstack-ai";

const searchTool = createTanstackExaWebSearchTool();

const result = chat({
  adapter: openaiText("gpt-4o-mini"),
  messages: [{ role: "user", content: "Latest AI news?" }],
  tools: [searchTool],
});`,
  },
};

export interface LandingToolTeaser {
  icon: LucideIcon;
  name: string;
  description: string;
  tags: string[];
}

export const landingPrimaryToolTags = ["web-search", "neural", "scraping"];

export const landingComingSoonTools: LandingToolTeaser[] = [
  {
    icon: Globe,
    name: "firecrawl-scrape",
    description:
      "Web scraping and crawling powered by Firecrawl. Extract clean content from any URL.",
    tags: ["scraping", "crawling"],
  },
  {
    icon: Search,
    name: "tavily-search",
    description:
      "AI-optimized web search via Tavily. Built for RAG and agent workflows.",
    tags: ["web-search", "rag"],
  },
  {
    icon: Terminal,
    name: "e2b-sandbox",
    description:
      "Secure code execution sandbox powered by E2B. Run untrusted code safely.",
    tags: ["code-exec", "sandbox"],
  },
  {
    icon: Monitor,
    name: "browserbase-browse",
    description:
      "AI-powered web browsing via Browserbase. Navigate, click, extract.",
    tags: ["browsing", "automation"],
  },
  {
    icon: Mail,
    name: "resend-email",
    description:
      "Send transactional emails through Resend. Perfect for AI notification workflows.",
    tags: ["email", "notifications"],
  },
];

export interface LandingAgentTeaser {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const landingAgentToolLabels = ["Search", "Analyze", "Report"];

export const landingAgentTeasers: LandingAgentTeaser[] = [
  {
    icon: Bot,
    title: "Research Agent",
    description:
      "Deep research agent that searches, reads, synthesizes, and produces structured reports.",
  },
  {
    icon: Code,
    title: "Coding Agent",
    description:
      "Code generation agent with web search, documentation lookup, and iterative refinement.",
  },
  {
    icon: Layers,
    title: "Data Agent",
    description:
      "Extract, transform, and analyze data from multiple sources with natural language.",
  },
];

export const landingSdkNames = [
  "Vercel AI SDK",
  "TanStack AI",
  "OpenAI",
  "Anthropic",
  "Google AI",
  "Mistral",
  "Groq",
  "Cohere",
];

export const landingStats = [
  { value: "1", label: "Tool available" },
  { value: "0", label: "Agents", comingSoon: true },
  { value: "2", label: "SDK adapters" },
  { value: "100%", label: "Open source" },
] as const;

export const landingVercelCode = `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createExaWebSearchTool } from "@ai-registry/exa";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: {
    webSearch: createExaWebSearchTool(),
  },
  prompt: "Find recent AI papers",
});`;

export const landingTanstackCode = `import { chat } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import {
  createTanstackExaWebSearchTool
} from "@ai-registry/exa/tanstack-ai";

const result = chat({
  adapter: openaiText("gpt-4o-mini"),
  tools: [createTanstackExaWebSearchTool()],
  messages: [
    { role: "user", content: "Find recent AI papers" }
  ],
});`;

export const landingCtaDecorativeSquares = [
  { size: 8, top: "2.5rem", left: "10%", rotate: 12, opacity: 0.2, delay: "0s" },
  {
    size: 12,
    top: "5rem",
    right: "15%",
    rotate: -8,
    opacity: 0.3,
    delay: "0.5s",
  },
  {
    size: 16,
    bottom: "4rem",
    left: "20%",
    rotate: 45,
    opacity: 0.4,
    delay: "1s",
  },
  {
    size: 20,
    bottom: "6rem",
    right: "12%",
    rotate: -15,
    opacity: 0.2,
    delay: "1.5s",
  },
  { size: 10, top: "8rem", left: "5%", rotate: 30, opacity: 0.3, delay: "2s" },
  {
    size: 14,
    top: "3rem",
    right: "8%",
    rotate: -45,
    opacity: 0.25,
    delay: "0.8s",
  },
  {
    size: 8,
    bottom: "10rem",
    left: "35%",
    rotate: 20,
    opacity: 0.35,
    delay: "1.2s",
  },
  {
    size: 18,
    bottom: "3rem",
    right: "30%",
    rotate: -10,
    opacity: 0.2,
    delay: "1.8s",
  },
  {
    size: 12,
    top: "12rem",
    right: "25%",
    rotate: 60,
    opacity: 0.3,
    delay: "0.3s",
  },
  {
    size: 10,
    bottom: "8rem",
    left: "8%",
    rotate: -25,
    opacity: 0.4,
    delay: "2.2s",
  },
];
