"use client";

import { motion } from "framer-motion";
import { fadeInUp, scrollTrigger } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  const alignClasses = align === "center" ? "text-center items-center" : "text-left items-start";
  const titleColor = light ? "text-white" : "text-black";
  const descColor = light ? "text-gray-400" : "text-gray-600";
  const eyebrowColor = light ? "text-accent" : "text-gray-500";

  return (
    <motion.div
      className={`flex flex-col gap-4 mb-16 ${alignClasses}`}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={scrollTrigger}
    >
      {eyebrow && (
        <span className={`text-sm font-mono uppercase tracking-widest ${eyebrowColor}`}>
          <span className="text-accent">■</span> {eyebrow}
        </span>
      )}
      <h2
        className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-tight ${titleColor}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-lg lg:text-xl max-w-2xl leading-relaxed ${descColor}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
