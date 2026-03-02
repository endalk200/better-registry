"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

export const useLandingNavigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return {
    mobileOpen,
    scrolled,
    closeMobileMenu: () => setMobileOpen(false),
    toggleMobileMenu: () => setMobileOpen((previous) => !previous),
  };
};
