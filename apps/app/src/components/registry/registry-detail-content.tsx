"use client";

import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";
import { RegistryDetailHero } from "./registry-detail-hero";
import { RegistrySidebar } from "./registry-sidebar";
import { RegistryCodeTabs } from "./registry-code-tabs";
import { RegistryApiTable } from "./registry-api-table";
import { fadeInUp } from "@/lib/motion";
import type { RegistryItem } from "@/data/registry";

interface RegistryDetailContentProps {
  item: RegistryItem;
}

export function RegistryDetailContent({ item }: RegistryDetailContentProps) {
  return (
    <div
      className="relative"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-12 pb-20 pt-10">
          {/* Sidebar */}
          <div className="w-56 shrink-0">
            <RegistrySidebar item={item} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <RegistryDetailHero item={item} />

            {/* Overview */}
            <section id="overview" className="scroll-mt-24 pb-14">
              <SectionTitle>Overview</SectionTitle>
              {item.longDescription && (
                <div className="max-w-2xl space-y-4 text-base leading-relaxed text-gray-600">
                  {item.longDescription.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}

              {item.features.length > 0 && (
                <ul className="mt-8 flex flex-col gap-2.5">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <span className="mt-0.5 text-accent">■</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Installation */}
            <section id="installation" className="scroll-mt-24 pb-14">
              <SectionTitle>Installation</SectionTitle>
              <div className="flex flex-col gap-6">
                <div>
                  <StepLabel step={1}>Install the tool</StepLabel>
                  <CodeBlock
                    code={item.installCommand}
                    language="bash"
                    accent
                  />
                </div>

                {item.configuration?.some((c) => c.name === "apiKey") && (
                  <div>
                    <StepLabel step={2}>Set your environment variable</StepLabel>
                    <CodeBlock
                      code={`# .env\nEXA_API_KEY=your_api_key_here`}
                      filename=".env"
                      language="bash"
                      accent
                    />
                  </div>
                )}

                <div>
                  <StepLabel
                    step={
                      item.configuration?.some((c) => c.name === "apiKey")
                        ? 3
                        : 2
                    }
                  >
                    Import and use
                  </StepLabel>
                  <CodeBlock
                    code={`import { ${item.type === "tool" ? `createExaWebSearchTool` : item.name} } from "@/tools/exa";`}
                    language="typescript"
                    accent
                  />
                </div>
              </div>
            </section>

            {/* Quick Start */}
            {item.quickStart.length > 0 && (
              <section id="quick-start" className="scroll-mt-24 pb-14">
                <SectionTitle>Quick Start</SectionTitle>
                <RegistryCodeTabs examples={item.quickStart} />
              </section>
            )}

            {/* API Reference */}
            {item.apiReference.length > 0 && (
              <section id="api-reference" className="scroll-mt-24 pb-14">
                <SectionTitle>API Reference</SectionTitle>
                <RegistryApiTable items={item.apiReference} variant="api" />
              </section>
            )}

            {/* Configuration */}
            {item.configuration && item.configuration.length > 0 && (
              <section id="configuration" className="scroll-mt-24 pb-14">
                <SectionTitle>Configuration</SectionTitle>
                <RegistryApiTable
                  items={item.configuration}
                  variant="config"
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="mb-6 border-b-2 border-gray-100 pb-3 text-2xl font-black"
    >
      {children}
    </motion.h2>
  );
}

function StepLabel({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="flex size-7 items-center justify-center border-2 border-black bg-accent font-mono text-xs font-bold">
        {step}
      </span>
      <span className="text-sm font-semibold">{children}</span>
    </div>
  );
}
