import type { ReactNode } from "react";
import { Navigation } from "@/components/landing/navigation";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Registry | better-registry",
  description:
    "Browse, search, and install open-source AI tools and agents. The shadcn for AI.",
};

export default function RegistryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
      <Footer />
    </>
  );
}
