"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BrutalBadge } from "@/components/ui/brutal-badge";
import { RegistryInstallBar } from "./registry-install-bar";
import { RegistryIcon } from "./registry-icon";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import type { RegistryItem } from "@/data/registry";

interface RegistryDetailHeroProps {
  item: RegistryItem;
}

export function RegistryDetailHero({ item }: RegistryDetailHeroProps) {

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="pb-10"
    >
      {/* Breadcrumb */}
      <motion.nav
        variants={fadeInUp}
        className="mb-8 flex items-center gap-2 font-mono text-sm text-gray-400"
      >
        <Link
          href="/registry"
          className="flex items-center gap-1.5 transition-colors hover:text-black"
        >
          <ArrowLeft className="size-3.5" />
          Registry
        </Link>
        <ChevronRight className="size-3" />
        <span className="capitalize">{item.type}s</span>
        <ChevronRight className="size-3" />
        <span className="text-black">{item.name}</span>
      </motion.nav>

      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center border-brutal bg-accent">
          <RegistryIcon name={item.icon} className="size-7 text-black" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-3xl font-black sm:text-4xl">
              {item.name}
            </h1>
            <BrutalBadge variant={item.status === "available" ? "live" : "coming-soon"}>
              {item.status === "available" ? "AVAILABLE" : "COMING SOON"}
            </BrutalBadge>
          </div>
          <p className="mt-1 font-mono text-sm text-gray-400">
            {item.packageName}
            {item.version && (
              <span className="ml-2 text-gray-300">v{item.version}</span>
            )}
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
            {item.description}
          </p>
        </div>
      </motion.div>

      {/* Badges row */}
      <motion.div
        variants={fadeInUp}
        className="mt-6 flex flex-wrap items-center gap-2"
      >
        {item.sdkSupport.map((sdk) => (
          <span
            key={sdk}
            className="bg-black px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent"
          >
            {sdk === "ai-sdk" ? "Vercel AI SDK" : "TanStack AI"}
          </span>
        ))}
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[11px] text-gray-500"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Install bar */}
      <motion.div variants={fadeInUp} className="mt-8">
        <RegistryInstallBar command={item.installCommand} />
      </motion.div>
    </motion.div>
  );
}
