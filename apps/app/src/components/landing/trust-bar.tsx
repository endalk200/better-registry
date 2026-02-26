"use client";

import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";
import { fadeInUp, scrollTrigger } from "@/lib/motion";

const sdkNames = [
  "Vercel AI SDK",
  "TanStack AI",
  "OpenAI",
  "Anthropic",
  "Google AI",
  "Mistral",
  "Groq",
  "Cohere",
];

const stats = [
  { value: "1", label: "Tool available" },
  { value: "0", label: "Agents", comingSoon: true },
  { value: "2", label: "SDK adapters" },
  { value: "100%", label: "Open source" },
];

export function TrustBar() {
  return (
    <section className="w-full bg-black text-white py-6 sm:py-8">
      {/* SDK Marquee */}
      <Marquee speed={25}>
        {sdkNames.map((name) => (
          <span key={name} className="flex items-center">
            <span className="text-sm sm:text-base font-mono text-white/80 whitespace-nowrap">
              {name}
            </span>
            <span className="text-accent mx-4 sm:mx-6">◆</span>
          </span>
        ))}
      </Marquee>

      {/* Stats bar */}
      <motion.div
        className="mt-6 sm:mt-8 max-w-4xl mx-auto px-4 sm:px-6"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollTrigger}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x-2 sm:divide-x-3 divide-white/20 gap-y-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center px-4"
            >
              <span className="text-3xl sm:text-4xl font-black text-accent">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-2">
                {stat.label}
                {"comingSoon" in stat && stat.comingSoon && (
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-hot text-white px-1.5 py-0.5">
                    SOON
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
