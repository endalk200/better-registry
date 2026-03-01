"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { BrutalButton } from "@/components/ui/brutal-button";

const navLinks = [
  { label: "Registry", href: "/registry" },
  { label: "Tools", href: "/registry?type=tool" },
  { label: "Agents", href: "/registry?type=agent" },
  { label: "Playground", href: "/playground" },
  { label: "GitHub", href: "https://github.com" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        className="sticky top-0 z-40 w-full h-16 bg-white border-b-3 border-black"
        animate={{
          boxShadow: scrolled ? "4px 4px 0px #000" : "0px 0px 0px #000",
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-0 select-none">
            <span className="text-accent text-xl leading-none mr-1.5">■</span>
            <span className="font-sans text-lg tracking-tight">
              better
              <span className="text-accent">-</span>
              <span className="font-black">registry</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative font-mono text-sm uppercase tracking-wider text-black transition-colors hover:text-accent"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-accent transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <BrutalButton variant="primary" size="sm" href="#get-started">
                Get Started
              </BrutalButton>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 cursor-pointer"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="block h-0.5 w-6 bg-black"
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 8 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 w-6 bg-black"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 w-6 bg-black"
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -8 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white flex flex-col"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Mobile menu header */}
            <div className="h-16 flex items-center justify-between px-6 border-b-3 border-black">
              <a href="/" className="flex items-center gap-0 select-none">
                <span className="text-accent text-xl leading-none mr-1.5">
                  ■
                </span>
                <span className="font-sans text-lg tracking-tight">
                  better
                  <span className="text-accent">-</span>
                  <span className="font-black">registry</span>
                </span>
              </a>
              <button
                type="button"
                className="flex flex-col justify-center items-center gap-1.5 w-10 h-10 cursor-pointer"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <motion.span
                  className="block h-0.5 w-6 bg-black"
                  style={{ rotate: 45, y: 4 }}
                />
                <motion.span
                  className="block h-0.5 w-6 bg-black"
                  style={{ rotate: -45, y: -4 }}
                />
              </button>
            </div>

            {/* Mobile nav links */}
            <div className="flex-1 flex flex-col">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="block border-b-3 border-black py-6 px-6 text-2xl font-black uppercase tracking-wider text-black hover:bg-accent transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="p-6 mt-auto">
                <BrutalButton
                  variant="primary"
                  size="lg"
                  href="#get-started"
                  className="w-full justify-center"
                >
                  Get Started
                </BrutalButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
