"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BrutalCardProps {
  children: ReactNode;
  hoverable?: boolean;
  tilt?: number;
  className?: string;
  dark?: boolean;
}

export function BrutalCard({
  children,
  hoverable = false,
  tilt = 0,
  className = "",
  dark = false,
}: BrutalCardProps) {
  const baseClasses = dark
    ? "bg-gray-900 border-3 border-gray-700 p-6"
    : "bg-white border-brutal p-6 shadow-brutal";

  if (hoverable) {
    return (
      <motion.div
        className={`${baseClasses} ${className}`}
        style={{ rotate: tilt }}
        whileHover={{
          x: -2,
          y: -2,
          boxShadow: "6px 6px 0px var(--accent)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      {children}
    </div>
  );
}
