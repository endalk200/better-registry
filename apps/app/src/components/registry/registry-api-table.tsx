"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import type { ApiProp, ConfigOption } from "@/data/registry";

interface RegistryApiTableProps {
  items: (ApiProp | ConfigOption)[];
  variant?: "api" | "config";
}

function isApiProp(item: ApiProp | ConfigOption): item is ApiProp {
  return "required" in item;
}

export function RegistryApiTable({
  items,
  variant = "api",
}: RegistryApiTableProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-col gap-3"
    >
      {items.map((item) => (
        <motion.div
          key={item.name}
          variants={fadeInUp}
          className="border-2 border-gray-200 bg-white p-4 transition-colors hover:border-black"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <code className="font-mono text-sm font-bold text-black">
              {item.name}
            </code>
            <code className="font-mono text-xs text-accent-dark">
              {item.type}
            </code>
            {isApiProp(item) && (
              <span
                className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  item.required ? "text-hot" : "text-gray-300"
                }`}
              >
                {item.required ? "required" : "optional"}
              </span>
            )}
            {"default" in item && item.default && (
              <span className="font-mono text-[11px] text-gray-400">
                = {item.default}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            {item.description}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
