"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { CodeBlock } from "@/components/ui/code-block";
import {
  fadeInUp,
  slideInLeft,
  slideInRight,
  scrollTrigger,
} from "@/lib/motion";

const vercelCode = `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createExaWebSearchTool } from "@ai-registry/exa";

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  tools: {
    webSearch: createExaWebSearchTool(),
  },
  prompt: "Find recent AI papers",
});`;

const tanstackCode = `import { chat } from "@tanstack/ai";
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

export function SDKComparison() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="SDK ADAPTERS"
          title="Same tool. Your framework."
          description="Every tool ships with adapters for the SDKs you already use. The core logic is identical — only the wrapper changes."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-10 sm:mt-14">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTrigger}
          >
            <CodeBlock
              filename="vercel-ai-sdk.ts"
              language="typescript"
              code={vercelCode}
            />
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTrigger}
          >
            <CodeBlock
              filename="tanstack-ai.ts"
              language="typescript"
              code={tanstackCode}
            />
          </motion.div>
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="mt-6 sm:mt-8"
        >
          <div
            className="bg-accent px-4 sm:px-6 py-3 sm:py-4 border-brutal shadow-brutal"
            style={{ transform: "rotate(-1deg)" }}
          >
            <p className="font-mono text-xs sm:text-sm text-black">
              {`// Both adapters call the same core function under the hood:`}
            </p>
            <p className="font-mono text-xs sm:text-sm text-black font-bold mt-1">
              {`import { webSearch } from "@ai-registry/exa/core";`}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
