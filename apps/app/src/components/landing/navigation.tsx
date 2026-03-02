"use client";

import Link from "next/link";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useLandingNavigation } from "@/app/landing/hooks/use-landing-navigation";
import { BrutalButton } from "@/components/ui/brutal-button";
import { landingNavLinks } from "@/lib/landing/content";

const isInternalRoute = (href: string): boolean =>
  href.startsWith("/") && !href.startsWith("//");

export function Navigation() {
  const { mobileOpen, scrolled, closeMobileMenu, toggleMobileMenu } =
    useLandingNavigation();

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
          <Link href="/" className="flex items-center gap-0 select-none">
            <span className="text-accent text-xl leading-none mr-1.5">■</span>
            <span className="font-sans text-lg tracking-tight">
              better
              <span className="text-accent">-</span>
              <span className="font-black">registry</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {landingNavLinks.map((link) =>
              isInternalRoute(link.href) ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group relative font-mono text-sm uppercase tracking-wider text-black transition-colors hover:text-accent"
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-accent transition-all duration-200 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="group relative font-mono text-sm uppercase tracking-wider text-black transition-colors hover:text-accent"
                  rel={link.external ? "noopener noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  {link.label}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-accent transition-all duration-200 group-hover:w-full" />
                </a>
              ),
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <BrutalButton variant="primary" size="sm" href="#get-started">
                Get Started
              </BrutalButton>
            </div>

            <button
              type="button"
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 cursor-pointer"
              onClick={toggleMobileMenu}
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white flex flex-col"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-16 flex items-center justify-between px-6 border-b-3 border-black">
              <Link
                href="/"
                className="flex items-center gap-0 select-none"
                onClick={closeMobileMenu}
              >
                <span className="text-accent text-xl leading-none mr-1.5">
                  ■
                </span>
                <span className="font-sans text-lg tracking-tight">
                  better
                  <span className="text-accent">-</span>
                  <span className="font-black">registry</span>
                </span>
              </Link>
              <button
                type="button"
                className="flex flex-col justify-center items-center gap-1.5 w-10 h-10 cursor-pointer"
                onClick={closeMobileMenu}
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

            <div className="flex-1 flex flex-col">
              {landingNavLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  {isInternalRoute(link.href) ? (
                    <Link
                      href={link.href}
                      className="block border-b-3 border-black py-6 px-6 text-2xl font-black uppercase tracking-wider text-black hover:bg-accent transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="block border-b-3 border-black py-6 px-6 text-2xl font-black uppercase tracking-wider text-black hover:bg-accent transition-colors"
                      onClick={closeMobileMenu}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      target={link.external ? "_blank" : undefined}
                    >
                      {link.label}
                    </a>
                  )}
                </motion.div>
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
