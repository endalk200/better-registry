"use client";

import { motion } from "framer-motion";
import { Layers, Code, Terminal, Shield, Puzzle, Zap } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const features = [
  {
    icon: Layers,
    iconBg: "bg-accent",
    title: "SDK-Agnostic Architecture",
    body: "Pure logic core with adapter layers. Write tools once, use them with Vercel AI SDK, TanStack AI, or any future framework. No lock-in, ever.",
    large: true,
    tilt: -1 as const,
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
    tilt: 1 as const,
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="WHY BETTER-REGISTRY"
          title="Built different."
          description="Everything you need to ship AI features, nothing you don't."
          align="left"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className={feature.large ? "lg:col-span-2" : ""}
              >
                <BrutalCard
                  hoverable
                  tilt={feature.tilt}
                  className="h-full p-5 sm:p-6"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 border-2 border-black flex items-center justify-center ${feature.iconBg}`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl mt-4">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                    {feature.body}
                  </p>

                  {feature.large && (
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <div className="px-3 py-1.5 border-2 border-black text-xs sm:text-sm font-mono bg-accent">
                        Core
                      </div>
                      <span className="text-base sm:text-lg font-bold">→</span>
                      <div className="px-3 py-1.5 border-2 border-black text-xs sm:text-sm font-mono bg-white">
                        Adapter
                      </div>
                      <span className="text-base sm:text-lg font-bold">→</span>
                      <div className="px-3 py-1.5 border-2 border-black text-xs sm:text-sm font-mono bg-gray-100">
                        Your SDK
                      </div>
                    </div>
                  )}
                </BrutalCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
