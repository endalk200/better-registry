"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RegistryIcon } from "./registry-icon";
import type { RegistryItem } from "@/data/registry";

interface RegistrySidebarProps {
  item: RegistryItem;
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "api-reference", label: "API Reference" },
  { id: "configuration", label: "Configuration" },
];

export function RegistrySidebar({ item }: RegistrySidebarProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const visibleSections = sections.filter((s) => {
    if (s.id === "configuration") return item.configuration && item.configuration.length > 0;
    if (s.id === "api-reference") return item.apiReference.length > 0;
    if (s.id === "quick-start") return item.quickStart.length > 0;
    return true;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    for (const section of visibleSections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [visibleSections]);

  return (
    <nav className="sticky top-20 hidden lg:block">
      {/* Tool identity */}
      <div className="mb-6 flex items-center gap-3 border-b-2 border-gray-100 pb-5">
        <div className="flex size-9 items-center justify-center border-2 border-black bg-accent">
          <RegistryIcon name={item.icon} className="size-4 text-black" />
        </div>
        <div>
          <p className="font-mono text-sm font-bold leading-tight">
            {item.name}
          </p>
          <p className="font-mono text-[10px] text-gray-400">
            {item.packageName}
          </p>
        </div>
      </div>

      {/* Section links */}
      <div className="flex flex-col gap-1">
        {visibleSections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth" });
                setActiveSection(section.id);
              }}
              className={`relative block py-2 pl-4 font-mono text-xs uppercase tracking-wider transition-colors ${
                isActive
                  ? "font-semibold text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-0 h-full w-1 bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
