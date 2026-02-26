"use client";

import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function Marquee({
  children,
  speed = 30,
  direction = "left",
  className = "",
}: MarqueeProps) {
  const animationDirection = direction === "left" ? "normal" : "reverse";

  return (
    <div className={`overflow-hidden group ${className}`}>
      <div
        className="flex w-max gap-8 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection,
        }}
      >
        {/* Duplicate children for seamless loop */}
        <div className="flex gap-8 shrink-0">{children}</div>
        <div className="flex gap-8 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
