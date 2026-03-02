import { AgentsShowcase } from "@/components/landing/agents-showcase";
import { CTA } from "@/components/landing/cta";
import { CodeShowcase } from "@/components/landing/code-showcase";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navigation } from "@/components/landing/navigation";
import { SDKComparison } from "@/components/landing/sdk-comparison";
import { ToolsShowcase } from "@/components/landing/tools-showcase";
import { TrustBar } from "@/components/landing/trust-bar";

const LANDING_SECTIONS = [
  { id: "hero", Component: Hero },
  { id: "trust", Component: TrustBar },
  { id: "how-it-works", Component: HowItWorks },
  { id: "features", Component: FeaturesGrid },
  { id: "code", Component: CodeShowcase },
  { id: "tools", Component: ToolsShowcase },
  { id: "agents", Component: AgentsShowcase },
  { id: "sdk-comparison", Component: SDKComparison },
  { id: "cta", Component: CTA },
] as const;

export const LandingPage = () => (
  <>
    <Navigation />
    <main>
      {LANDING_SECTIONS.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </main>
    <Footer />
  </>
);
