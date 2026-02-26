"use client";

import type { ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "coming-soon" | "live";

interface BrutalBadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-black border-2 border-black",
  accent: "bg-accent text-black border-2 border-black",
  "coming-soon": "bg-hot text-white border-2 border-black",
  live: "bg-accent text-black border-2 border-black",
};

export function BrutalBadge({
  children,
  variant = "default",
  className = "",
}: BrutalBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-widest font-semibold ${variantStyles[variant]} ${className}`}
    >
      {variant === "coming-soon" && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-white"
          style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
        />
      )}
      {variant === "live" && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-black" />
      )}
      {children}
    </span>
  );
}
