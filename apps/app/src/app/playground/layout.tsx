import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = {
  title: "Playground | better-registry",
  description: "Test AI models with the better-registry playground.",
};

export default function PlaygroundLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
