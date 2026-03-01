import type { RegistryItem } from "../types";

const shared = {
  type: "tool" as const,
  status: "coming-soon" as const,
  longDescription: "",
  sdkSupport: ["ai-sdk" as const, "tanstack-ai" as const],
  features: [],
  quickStart: [],
  apiReference: [],
};

export const firecrawlScrape: RegistryItem = {
  ...shared,
  slug: "firecrawl-scrape",
  name: "firecrawl-scrape",
  packageName: "@ai-registry/firecrawl",
  description:
    "Web scraping and crawling powered by Firecrawl. Extract clean content from any URL.",
  icon: "globe",
  tags: ["scraping", "crawling"],
  installCommand: "npx better-registry add firecrawl-scrape",
};

export const tavilySearch: RegistryItem = {
  ...shared,
  slug: "tavily-search",
  name: "tavily-search",
  packageName: "@ai-registry/tavily",
  description:
    "AI-optimized web search via Tavily. Built for RAG and agent workflows.",
  icon: "search",
  tags: ["web-search", "rag"],
  installCommand: "npx better-registry add tavily-search",
};

export const e2bSandbox: RegistryItem = {
  ...shared,
  slug: "e2b-sandbox",
  name: "e2b-sandbox",
  packageName: "@ai-registry/e2b",
  description:
    "Secure code execution sandbox powered by E2B. Run untrusted code safely.",
  icon: "terminal",
  tags: ["code-exec", "sandbox"],
  installCommand: "npx better-registry add e2b-sandbox",
};

export const browserbaseBrowse: RegistryItem = {
  ...shared,
  slug: "browserbase-browse",
  name: "browserbase-browse",
  packageName: "@ai-registry/browserbase",
  description:
    "AI-powered web browsing via Browserbase. Navigate, click, extract.",
  icon: "monitor",
  tags: ["browsing", "automation"],
  installCommand: "npx better-registry add browserbase-browse",
};

export const resendEmail: RegistryItem = {
  ...shared,
  slug: "resend-email",
  name: "resend-email",
  packageName: "@ai-registry/resend",
  description:
    "Send transactional emails through Resend. Perfect for AI notification workflows.",
  icon: "mail",
  tags: ["email", "notifications"],
  installCommand: "npx better-registry add resend-email",
};
