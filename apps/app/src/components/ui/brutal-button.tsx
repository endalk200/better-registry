"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type BrutalButtonVariant = "primary" | "secondary" | "ghost";
type BrutalButtonSize = "sm" | "md" | "lg";

interface BrutalButtonProps {
  children: ReactNode;
  variant?: BrutalButtonVariant;
  size?: BrutalButtonSize;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  type?: "button" | "submit";
}

const variantStyles: Record<BrutalButtonVariant, string> = {
  primary:
    "bg-accent text-black border-brutal shadow-brutal hover:shadow-brutal-lg",
  secondary:
    "bg-white text-black border-brutal shadow-brutal hover:bg-accent hover:shadow-brutal-lg",
  ghost:
    "bg-transparent text-black border-brutal hover:bg-gray-100",
};

const sizeStyles: Record<BrutalButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function BrutalButton({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  icon,
  iconRight,
  className = "",
  type = "button",
}: BrutalButtonProps) {
  const classes = `inline-flex items-center gap-2 font-semibold font-sans transition-colors cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ x: -2, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={{ x: -2, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {content}
    </motion.button>
  );
}
