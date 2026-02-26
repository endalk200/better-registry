"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { CodeBlock } from "@/components/ui/code-block";
import { fadeInUp, staggerContainer } from "@/lib/motion";

type Tab = "core" | "ai-sdk" | "tanstack";

const tabs: { id: Tab; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "ai-sdk", label: "AI SDK" },
  { id: "tanstack", label: "TanStack" },
];

const descriptions: Record<Tab, string> = {
  core: "Start with the core. Zero dependencies, zero framework opinions. Just a typed async function that calls Exa's API. Use it in any JavaScript runtime — Node, Deno, Bun, edge functions.",
  "ai-sdk":
    "Drop it into generateText or streamText. The adapter wraps the core function with Zod schemas and tool() from the AI SDK. Fully compatible with agents, tool loops, and streaming.",
  tanstack:
    "First-class TanStack AI support. Uses toolDefinition() with full input/output Zod schemas. Works with chat(), streaming, and TanStack's server tool pattern.",
};

const codeSnippets: Record<Tab, { code: string; filename: string }> = {
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

export function CodeShowcase() {
  const [activeTab, setActiveTab] = useState<Tab>("core");

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="SEE IT IN ACTION"
          title="One tool. Every SDK."
          description="The same Exa web search tool works everywhere. Pick your SDK, get the right adapter."
          align="left"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start"
        >
          <motion.div variants={fadeInUp}>
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-mono text-xs sm:text-sm px-3 sm:px-4 py-2 uppercase tracking-wider cursor-pointer transition-colors ${
                    activeTab === tab.id
                      ? "bg-accent text-black border-brutal shadow-brutal font-semibold"
                      : "bg-white text-black border-brutal hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm sm:text-base text-gray-600 leading-relaxed"
              >
                {descriptions[activeTab]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CodeBlock
                  code={codeSnippets[activeTab].code}
                  filename={codeSnippets[activeTab].filename}
                  language="typescript"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
