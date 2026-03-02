"use client";

import { motion } from "framer-motion";
import {
  Terminal,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { BrutalBadge } from "@/components/ui/brutal-badge";
import { BrutalButton } from "@/components/ui/brutal-button";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import {
  landingHeroAccentWords,
  landingHeroCodePreview,
  landingHeroHeadlineWords,
  landingHeroInstallCommand,
  landingHeroTerminalLines,
} from "@/lib/landing/content";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function Hero() {
  const { copied, copy } = useCopyToClipboard();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
          {/* Left side — text content */}
          <motion.div
            className="flex-1 lg:max-w-[50%] pt-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow badge */}
            <motion.div variants={fadeInUp}>
              <BrutalBadge variant="accent" className="mb-6">
                <span style={{ display: "inline-block", rotate: "-2deg" }}>
                  OPEN SOURCE
                </span>
              </BrutalBadge>
            </motion.div>

            {/* Headline */}
            <motion.h1 className="mb-6" variants={fadeInUp}>
              <span className="block">
                {landingHeroHeadlineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block text-5xl sm:text-6xl lg:text-[5rem] font-black text-black leading-[1.1] mr-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word.text}
                  </motion.span>
                ))}
              </span>
              <span className="block mt-2">
                {landingHeroAccentWords.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block text-5xl sm:text-6xl lg:text-[5rem] font-black leading-[1.1] mr-4"
                    style={{
                      color: "var(--accent)",
                      WebkitTextStroke: "2px black",
                    }}
                    initial={{
                      opacity: 0,
                      y: 20,
                      textShadow:
                        "3px 3px 0px var(--hot), -2px -2px 0px var(--accent)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      textShadow: "0px 0px 0px transparent",
                    }}
                    transition={{
                      delay: 0.5 + i * 0.12,
                      duration: 1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word.text}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              className="text-lg lg:text-xl text-gray-600 max-w-xl leading-relaxed mb-8"
              variants={fadeInUp}
            >
              Open-source, SDK-agnostic AI tools and agents. Install with one
              command. Own the source code. Ship faster.
            </motion.p>

            {/* CTA group */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-8"
              variants={fadeInUp}
            >
              {/* Terminal command */}
              <div className="bg-white border-brutal shadow-brutal px-4 sm:px-6 py-3 flex items-center gap-3 font-mono text-sm sm:text-base select-all">
                <Terminal className="w-4 h-4 text-gray-400 shrink-0 select-none" />
                <span className="text-black">{landingHeroInstallCommand}</span>
                <button
                  type="button"
                  onClick={() => copy(landingHeroInstallCommand)}
                  className="ml-2 shrink-0 cursor-pointer text-gray-400 hover:text-black transition-colors select-none"
                  aria-label="Copy command"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-accent-dark" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <BrutalButton
                variant="ghost"
                size="md"
                href="#docs"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Read the Docs
              </BrutalButton>

              <BrutalButton
                variant="secondary"
                size="md"
                href="/playground"
                icon={<Sparkles className="w-4 h-4" />}
              >
                Try Playground
              </BrutalButton>
            </motion.div>

            {/* Micro social proof */}
            <motion.p className="text-sm text-gray-500" variants={fadeInUp}>
              Built for{" "}
              <span className="font-semibold text-gray-700">Vercel AI SDK</span>{" "}
              & <span className="font-semibold text-gray-700">TanStack AI</span>
            </motion.p>
          </motion.div>

          {/* Right side — animated terminal + code preview */}
          <motion.div
            className="hidden lg:flex flex-1 lg:max-w-[50%] flex-col gap-4 pt-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Terminal window */}
            <div className="bg-gray-950 border-brutal shadow-brutal overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800 bg-gray-900">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 border border-red-600" />
                  <div className="w-3 h-3 bg-yellow-500 border border-yellow-600" />
                  <div className="w-3 h-3 bg-green-500 border border-green-600" />
                </div>
                <span className="text-xs font-mono text-gray-500 ml-2">
                  terminal
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-4 font-mono text-sm space-y-1.5 min-h-[180px]">
                {landingHeroTerminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: line.delay,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    {line.type === "command" && (
                      <div className="flex items-center gap-2">
                        <span className="text-accent">$</span>
                        <span className="text-gray-200">{line.text}</span>
                        <motion.span
                          className="w-2 h-4 bg-accent inline-block"
                          animate={{ opacity: [1, 0] }}
                          transition={{
                            delay: line.delay,
                            duration: 0.6,
                            repeat: 2,
                            repeatType: "reverse",
                          }}
                        />
                      </div>
                    )}
                    {line.type === "output" && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>{line.text.replace("✓ ", "")}</span>
                      </div>
                    )}
                    {line.type === "success" && (
                      <motion.div
                        className="flex items-center gap-2 mt-2 text-accent font-bold"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: line.delay + 0.1, type: "spring" }}
                      >
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>{line.text}</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Code preview — what you get */}
            <motion.div
              className="bg-gray-950 border-brutal shadow-brutal overflow-hidden"
              style={{ transform: "rotate(0.5deg)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 3.0,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent" />
                  <span className="text-xs font-mono text-gray-400">
                    your-app/tools/exa.ts
                  </span>
                </div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                  your code now
                </span>
              </div>

              {/* Code */}
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs font-mono leading-relaxed text-gray-300">
                  {landingHeroCodePreview.split("\n").map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.2 + i * 0.08, duration: 0.3 }}
                    >
                      <span className="text-gray-600 select-none mr-4 inline-block w-4 text-right">
                        {i + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightLine(line),
                        }}
                      />
                    </motion.div>
                  ))}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Minimal syntax highlighting for the hero code preview */
function highlightLine(line: string): string {
  let result = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Strings
  result = result.replace(
    /(".*?"|'.*?'|`.*?`)/g,
    '<span style="color: #a3a3a3">$1</span>',
  );

  // Keywords
  result = result.replace(
    /\b(import|from|export|const|let|var|async|await|function|return)\b/g,
    '<span style="color: var(--accent)">$1</span>',
  );

  return result;
}
