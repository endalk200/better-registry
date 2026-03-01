"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";
import type { CodeExample } from "@/data/registry";

interface RegistryCodeTabsProps {
  examples: CodeExample[];
}

const sdkLabels: Record<string, string> = {
  "ai-sdk": "AI SDK",
  "tanstack-ai": "TanStack AI",
  core: "Core",
};

export function RegistryCodeTabs({ examples }: RegistryCodeTabsProps) {
  const [activeTab, setActiveTab] = useState(examples[0]?.sdk ?? "ai-sdk");
  const activeExample = examples.find((e) => e.sdk === activeTab) ?? examples[0];

  if (!activeExample) return null;

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b-3 border-black">
        {examples.map((example) => {
          const isActive = example.sdk === activeTab;

          return (
            <button
              key={example.sdk}
              type="button"
              onClick={() => setActiveTab(example.sdk)}
              className={`relative cursor-pointer px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-white text-black"
                  : "bg-gray-100 text-gray-400 hover:text-gray-600"
              }`}
            >
              {sdkLabels[example.sdk] ?? example.sdk}
              {isActive && (
                <motion.span
                  layoutId="code-tab-indicator"
                  className="absolute inset-x-0 -bottom-[3px] h-[3px] bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Code */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <CodeBlock
            code={activeExample.code}
            filename={activeExample.filename}
            language={activeExample.language}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
