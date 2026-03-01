"use client";

import { motion } from "framer-motion";

type ItemType = "all" | "tool" | "agent";

interface RegistryFilterBarProps {
  activeType: ItemType;
  onTypeChange: (type: ItemType) => void;
  activeSdk: string | null;
  onSdkChange: (sdk: string | null) => void;
  activeTags: string[];
  onTagToggle: (tag: string) => void;
  allTags: string[];
  resultCount: number;
}

const typeFilters: { label: string; value: ItemType }[] = [
  { label: "All", value: "all" },
  { label: "Tools", value: "tool" },
  { label: "Agents", value: "agent" },
];

const sdkFilters = [
  { label: "AI SDK", value: "ai-sdk" },
  { label: "TanStack AI", value: "tanstack-ai" },
];

export function RegistryFilterBar({
  activeType,
  onTypeChange,
  activeSdk,
  onSdkChange,
  activeTags,
  onTagToggle,
  allTags,
  resultCount,
}: RegistryFilterBarProps) {
  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {/* Type + SDK + Count row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type toggles */}
        <div className="flex">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onTypeChange(filter.value)}
              className={`cursor-pointer border-2 border-black px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors first:border-r-0 last:border-l-0 ${
                activeType === filter.value
                  ? "bg-accent text-black"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* SDK toggles */}
        <div className="flex gap-2">
          {sdkFilters.map((sdk) => (
            <button
              key={sdk.value}
              type="button"
              onClick={() =>
                onSdkChange(activeSdk === sdk.value ? null : sdk.value)
              }
              className={`cursor-pointer border-2 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                activeSdk === sdk.value
                  ? "border-black bg-black text-accent"
                  : "border-gray-300 bg-white text-gray-500 hover:border-black"
              }`}
            >
              {sdk.label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Count */}
        <span className="font-mono text-xs text-gray-400">
          {resultCount} {resultCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Tag row */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagToggle(tag)}
              className={`cursor-pointer border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                activeTags.includes(tag)
                  ? "border-black bg-accent/20 text-black"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
