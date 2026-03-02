"use client";

import { motion } from "framer-motion";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { landingFeatures } from "@/lib/landing/content";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function FeaturesGrid() {
  return (
    <section className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="WHY BETTER-REGISTRY"
          title="Built different."
          description="Everything you need to ship AI features, nothing you don't."
          align="left"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {landingFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className={feature.large ? "lg:col-span-2" : ""}
              >
                <BrutalCard
                  hoverable
                  tilt={feature.tilt}
                  className="h-full p-5 sm:p-6"
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 border-2 border-black flex items-center justify-center ${feature.iconBg}`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl mt-4">
                    {feature.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
                    {feature.body}
                  </p>

                  {feature.large && (
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <div className="px-3 py-1.5 border-2 border-black text-xs sm:text-sm font-mono bg-accent">
                        Core
                      </div>
                      <span className="text-base sm:text-lg font-bold">→</span>
                      <div className="px-3 py-1.5 border-2 border-black text-xs sm:text-sm font-mono bg-white">
                        Adapter
                      </div>
                      <span className="text-base sm:text-lg font-bold">→</span>
                      <div className="px-3 py-1.5 border-2 border-black text-xs sm:text-sm font-mono bg-gray-100">
                        Your SDK
                      </div>
                    </div>
                  )}
                </BrutalCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
