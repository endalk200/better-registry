"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCodeShowcaseTab } from "@/app/landing/hooks/use-code-showcase-tab";
import { SectionHeading } from "@/components/ui/section-heading";
import { CodeBlock } from "@/components/ui/code-block";
import {
  landingCodeShowcaseDescriptions,
  landingCodeShowcaseSnippets,
  landingCodeShowcaseTabs,
} from "@/lib/landing/content";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function CodeShowcase() {
  const { activeTab, setActiveTab } = useCodeShowcaseTab();

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
              {landingCodeShowcaseTabs.map((tab) => (
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
                {landingCodeShowcaseDescriptions[activeTab]}
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
                  code={landingCodeShowcaseSnippets[activeTab].code}
                  filename={landingCodeShowcaseSnippets[activeTab].filename}
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
