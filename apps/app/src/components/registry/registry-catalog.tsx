"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { RegistrySearch } from "./registry-search";
import { RegistryFilterBar } from "./registry-filter-bar";
import { RegistryGrid } from "./registry-grid";
import { registryItems, getAllTags } from "@/data/registry";
import { fadeInUp } from "@/lib/motion";

type ItemType = "all" | "tool" | "agent";

function isValidType(value: string | null): value is ItemType {
  return value === "all" || value === "tool" || value === "agent";
}

export function RegistryCatalog() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<ItemType>(
    isValidType(typeParam) ? typeParam : "all",
  );
  const [activeSdk, setActiveSdk] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    if (isValidType(typeParam)) {
      setActiveType(typeParam);
    }
  }, [typeParam]);

  const allTags = useMemo(() => getAllTags(), []);

  const filtered = useMemo(() => {
    let items = registryItems;

    if (activeType !== "all") {
      items = items.filter((item) => item.type === activeType);
    }

    if (activeSdk) {
      items = items.filter((item) =>
        item.sdkSupport.includes(activeSdk as "ai-sdk" | "tanstack-ai"),
      );
    }

    if (activeTags.length > 0) {
      items = items.filter((item) =>
        activeTags.some((tag) => item.tags.includes(tag)),
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.packageName.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.includes(q)),
      );
    }

    return items;
  }, [search, activeType, activeSdk, activeTags]);

  function handleTagToggle(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  return (
    <div
      className="relative"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <div className="pb-10 pt-14 sm:pt-20">
          <motion.div
            className="mb-10 flex flex-col items-center text-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <span className="mb-4 font-mono text-sm uppercase tracking-widest text-gray-500">
              <span className="text-accent">■</span> REGISTRY
            </span>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-[3.5rem]">
              Find your next AI
              <br />
              <span
                className="text-accent"
                style={{ WebkitTextStroke: "1.5px black" }}
              >
                building block.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
              Browse tools and agents. Install with one command. Own the source.
            </p>
          </motion.div>

          {/* Search */}
          <div className="mx-auto max-w-2xl">
            <RegistrySearch value={search} onChange={setSearch} />
          </div>
        </div>

        {/* Filters */}
        <div className="pb-8">
          <RegistryFilterBar
            activeType={activeType}
            onTypeChange={setActiveType}
            activeSdk={activeSdk}
            onSdkChange={setActiveSdk}
            activeTags={activeTags}
            onTagToggle={handleTagToggle}
            allTags={allTags}
            resultCount={filtered.length}
          />
        </div>

        {/* Grid */}
        <div className="pb-20">
          <RegistryGrid items={filtered} />
        </div>
      </div>
    </div>
  );
}
