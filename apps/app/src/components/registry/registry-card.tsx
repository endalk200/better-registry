"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrutalBadge } from "@/components/ui/brutal-badge";
import { RegistryInstallBar } from "./registry-install-bar";
import { RegistryIcon } from "./registry-icon";
import type { RegistryItem } from "@/data/registry";

interface RegistryCardProps {
  item: RegistryItem;
  index: number;
}

export function RegistryCard({ item, index }: RegistryCardProps) {
  const isAvailable = item.status === "available";

  const card = (
    <motion.div
      className={`group relative flex h-full flex-col border-3 border-black bg-white p-5 transition-shadow ${
        isAvailable
          ? "shadow-brutal hover:shadow-brutal-accent"
          : "opacity-55 border-gray-300"
      }`}
      style={
        !isAvailable
          ? { animation: "shimmer 4s ease-in-out infinite" }
          : undefined
      }
      whileHover={isAvailable ? { x: -2, y: -2 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Top row: index + badge */}
      <div className="mb-4 flex items-start justify-between">
        <span className="font-mono text-[11px] text-gray-300 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <BrutalBadge variant={isAvailable ? "live" : "coming-soon"}>
          {isAvailable ? "AVAILABLE" : "COMING SOON"}
        </BrutalBadge>
      </div>

      {/* Icon */}
      <div
        className={`flex size-11 items-center justify-center border-2 ${
          isAvailable
            ? "border-black bg-accent"
            : "border-gray-400 bg-gray-100"
        }`}
      >
        <RegistryIcon
          name={item.icon}
          className={`size-5 ${isAvailable ? "text-black" : "text-gray-400"}`}
        />
      </div>

      {/* Name + package */}
      <h3 className="mt-3 font-mono text-lg font-bold leading-tight">
        {item.name}
      </h3>
      <p className="font-mono text-[11px] text-gray-400">{item.packageName}</p>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
        {item.description}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[10px] text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* SDK badges */}
      <div className="mt-3 flex gap-2">
        {item.sdkSupport.map((sdk) => (
          <span
            key={sdk}
            className={`px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
              isAvailable
                ? "bg-black text-accent"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            {sdk === "ai-sdk" ? "AI SDK" : "TanStack"}
          </span>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Install command */}
      {isAvailable && (
        <div className="mt-4">
          <RegistryInstallBar command={item.installCommand} compact />
        </div>
      )}
    </motion.div>
  );

  if (isAvailable) {
    return (
      <Link
        href={`/registry/${item.type}s/${item.slug}`}
        className="block h-full no-underline"
      >
        {card}
      </Link>
    );
  }

  return card;
}
