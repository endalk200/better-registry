import type { RegistryItem } from "../types";

const shared = {
  type: "agent" as const,
  status: "coming-soon" as const,
  longDescription: "",
  sdkSupport: ["ai-sdk" as const, "tanstack-ai" as const],
  features: [],
  quickStart: [],
  apiReference: [],
};

export const researchAgent: RegistryItem = {
  ...shared,
  slug: "research-agent",
  name: "research-agent",
  packageName: "@ai-registry/research-agent",
  description:
    "Deep research agent that searches, reads, synthesizes, and produces structured reports.",
  icon: "bot",
  tags: ["research", "rag", "reports"],
  installCommand: "npx better-registry add research-agent",
};

export const codingAgent: RegistryItem = {
  ...shared,
  slug: "coding-agent",
  name: "coding-agent",
  packageName: "@ai-registry/coding-agent",
  description:
    "Code generation agent with web search, documentation lookup, and iterative refinement.",
  icon: "code",
  tags: ["code-gen", "docs", "refactoring"],
  installCommand: "npx better-registry add coding-agent",
};

export const dataAgent: RegistryItem = {
  ...shared,
  slug: "data-agent",
  name: "data-agent",
  packageName: "@ai-registry/data-agent",
  description:
    "Extract, transform, and analyze data from multiple sources with natural language.",
  icon: "layers",
  tags: ["etl", "analysis", "data"],
  installCommand: "npx better-registry add data-agent",
};
