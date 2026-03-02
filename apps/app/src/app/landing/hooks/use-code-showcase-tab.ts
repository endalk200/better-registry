"use client";

import { useState } from "react";
import type { LandingCodeTab } from "@/lib/landing/content";

export const useCodeShowcaseTab = (initialTab: LandingCodeTab = "core") => {
  const [activeTab, setActiveTab] = useState<LandingCodeTab>(initialTab);

  return {
    activeTab,
    setActiveTab,
  };
};
