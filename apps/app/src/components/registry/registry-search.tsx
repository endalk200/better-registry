"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface RegistrySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function RegistrySearch({ value, onChange }: RegistrySearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative flex items-center border-brutal bg-white shadow-brutal transition-shadow focus-within:shadow-brutal-accent">
        <span className="pl-4 pr-1 font-mono text-lg text-accent select-none">
          $
        </span>
        <Search className="mr-2 size-4 shrink-0 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tools and agents..."
          className="h-14 w-full bg-transparent pr-4 font-mono text-base text-black placeholder:text-gray-400 focus:outline-none"
        />
        <kbd className="mr-4 hidden shrink-0 items-center gap-1 border-2 border-gray-200 bg-gray-50 px-2 py-1 font-mono text-[11px] text-gray-400 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </motion.div>
  );
}
