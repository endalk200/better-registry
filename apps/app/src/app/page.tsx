import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { CodeShowcase } from "@/components/landing/code-showcase";
import { ToolsShowcase } from "@/components/landing/tools-showcase";
import { AgentsShowcase } from "@/components/landing/agents-showcase";
import { SDKComparison } from "@/components/landing/sdk-comparison";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <FeaturesGrid />
        <CodeShowcase />
        <ToolsShowcase />
        <AgentsShowcase />
        <SDKComparison />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
