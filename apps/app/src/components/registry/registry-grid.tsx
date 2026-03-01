"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RegistryCard } from "./registry-card";
import type { RegistryItem } from "@/data/registry";

interface RegistryGridProps {
  items: RegistryItem[];
}

export function RegistryGrid({ items }: RegistryGridProps) {
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 flex size-16 items-center justify-center border-brutal bg-gray-50">
          <span className="font-mono text-2xl text-gray-300">?</span>
        </div>
        <p className="font-mono text-sm text-gray-400">
          No items match your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.slug}
          initial={{
            opacity: 0,
            y: hasMounted.current ? 0 : 20,
          }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: hasMounted.current ? 0.15 : 0.4,
            delay: hasMounted.current ? 0 : i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <RegistryCard item={item} index={i} />
        </motion.div>
      ))}
    </div>
  );
}
