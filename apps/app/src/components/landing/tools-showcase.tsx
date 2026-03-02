"use client";

import { motion } from "framer-motion";
import {
  Search,
  Copy,
  Check,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalBadge } from "@/components/ui/brutal-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  landingComingSoonTools,
  landingHeroInstallCommand,
  landingPrimaryToolTags,
  type LandingToolTeaser,
} from "@/lib/landing/content";
import { fadeInUp, staggerContainer, scrollTrigger } from "@/lib/motion";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

function ExaSearchCard() {
  const { copied, copy } = useCopyToClipboard();

  return (
    <BrutalCard className="bg-white text-black">
      <div className="flex items-center justify-between mb-4">
        <BrutalBadge variant="live">AVAILABLE</BrutalBadge>
      </div>

      <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black flex items-center justify-center bg-accent">
        <Search className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <h3 className="font-mono font-bold text-lg sm:text-xl mt-4">
        exa-search
      </h3>
      <p className="font-mono text-xs sm:text-sm text-gray-500">
        @ai-registry/exa
      </p>
      <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
        Neural and keyword web search powered by Exa. Includes content scraping,
        highlights, and summaries.
      </p>

      <div className="flex gap-2 mt-3">
        {landingPrimaryToolTags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 border border-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="bg-gray-950 text-accent font-mono text-xs px-3 py-2 border-2 border-black flex items-center justify-between gap-2 mt-4">
        <span className="truncate">{landingHeroInstallCommand}</span>
        <button
          type="button"
          onClick={() => copy(landingHeroInstallCommand)}
          className="shrink-0 p-1 hover:text-white transition-colors"
          aria-label="Copy install command"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </BrutalCard>
  );
}

function ComingSoonCard({ tool }: { tool: LandingToolTeaser }) {
  const Icon = tool.icon;

  return (
    <div
      className="opacity-60"
      style={{ animation: "shimmer 3s ease-in-out infinite" }}
    >
      <BrutalCard dark>
        <div className="flex items-center justify-between mb-4">
          <BrutalBadge variant="coming-soon">COMING SOON</BrutalBadge>
        </div>

        <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-gray-600 flex items-center justify-center bg-gray-800">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
        </div>

        <h3 className="font-mono font-bold text-lg text-gray-300 mt-4">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          {tool.description}
        </p>

        <div className="flex gap-2 mt-3">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 border border-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </BrutalCard>
    </div>
  );
}

export function ToolsShowcase() {
  return (
    <section className="bg-gray-950 text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="TOOL REGISTRY"
          title="Tools that extend your AI."
          description="Pre-built, tested, SDK-agnostic functions. Install, customize, ship."
          light
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <motion.div variants={fadeInUp}>
            <ExaSearchCard />
          </motion.div>

          {landingComingSoonTools.map((tool) => (
            <motion.div key={tool.name} variants={fadeInUp}>
              <ComingSoonCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
