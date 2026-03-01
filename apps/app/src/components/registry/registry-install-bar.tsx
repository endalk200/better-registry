"use client";

import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface RegistryInstallBarProps {
  command: string;
  className?: string;
  compact?: boolean;
}

export function RegistryInstallBar({
  command,
  className = "",
  compact = false,
}: RegistryInstallBarProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div
      className={`flex items-center justify-between gap-3 border-2 border-black bg-gray-950 font-mono text-accent ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      } ${className}`}
    >
      <span className="truncate">{command}</span>
      <button
        type="button"
        onClick={() => copy(command)}
        className="shrink-0 cursor-pointer p-1 text-gray-500 transition-colors hover:text-white"
        aria-label="Copy install command"
      >
        {copied ? (
          <Check className={compact ? "size-3.5" : "size-4"} />
        ) : (
          <Copy className={compact ? "size-3.5" : "size-4"} />
        )}
      </button>
    </div>
  );
}
