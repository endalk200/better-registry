"use client";

import { motion } from "framer-motion";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalBadge } from "@/components/ui/brutal-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  landingAgentTeasers,
  landingAgentToolLabels,
} from "@/lib/landing/content";
import { fadeInUp, staggerContainer, scrollTrigger } from "@/lib/motion";

export function AgentsShowcase() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="AGENT REGISTRY"
          title="Agents that think for you."
          description="Pre-configured LLM + tool loop combinations for complex workflows. Install a complete agent with one command."
        />

        {/* Agent Diagram Card */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="max-w-3xl mx-auto"
        >
          <BrutalCard className="relative overflow-hidden">
            <BrutalBadge
              variant="coming-soon"
              className="absolute top-4 right-4 sm:top-6 sm:right-6"
            >
              COMING SOON
            </BrutalBadge>

            <motion.div
              animate={{ scale: [1, 1.01, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="py-8 sm:py-12"
            >
              {/* Tool boxes */}
              <div className="flex justify-center gap-8 sm:gap-16 mb-4 sm:mb-6">
                {landingAgentToolLabels.map((label) => (
                  <div
                    key={label}
                    className="px-3 sm:px-4 py-2 border-2 border-black bg-accent text-black font-mono text-xs sm:text-sm font-semibold"
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Dashed connectors */}
              <div className="h-6 sm:h-8 flex justify-center items-center gap-8 sm:gap-16">
                {landingAgentToolLabels.map((label) => (
                  <div
                    key={`line-${label}`}
                    className="w-0 h-full border-l-2 border-dashed border-accent"
                  />
                ))}
              </div>

              {/* LLM box */}
              <div className="flex justify-center mt-4 sm:mt-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black text-white border-brutal flex items-center justify-center font-black text-lg sm:text-xl">
                  LLM
                </div>
              </div>
            </motion.div>
          </BrutalCard>
        </motion.div>

        {/* Teaser Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12"
        >
          {landingAgentTeasers.map((agent) => {
            const Icon = agent.icon;

            return (
              <motion.div key={agent.title} variants={fadeInUp}>
                <div className="opacity-70">
                  <BrutalCard className="bg-gray-50 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <BrutalBadge variant="coming-soon">
                        COMING SOON
                      </BrutalBadge>
                    </div>

                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500" />

                    <h3 className="font-bold text-base sm:text-lg mt-3">
                      {agent.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {agent.description}
                    </p>
                  </BrutalCard>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <p className="text-center mt-8 sm:mt-10 text-sm sm:text-base text-gray-500">
          Want to be notified when agents launch?{" "}
          <a
            href="https://github.com/ai-registry/ai-registry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-semibold underline decoration-accent decoration-2 underline-offset-4 hover:text-accent transition-colors"
          >
            Star us on GitHub
          </a>
        </p>
      </div>
    </section>
  );
}
