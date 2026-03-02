"use client";

import { motion } from "framer-motion";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { landingHowItWorksSteps } from "@/lib/landing/content";
import { fadeInUp, staggerContainer, scrollTrigger } from "@/lib/motion";

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="Three commands to superpowers."
          description="From zero to AI-powered in under a minute."
        />

        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
        >
          {/* Connecting dashed line between step numbers (desktop only) */}
          <div className="hidden md:block absolute top-6 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] border-t-3 border-dashed border-black" />

          {landingHowItWorksSteps.map((step) => (
            <motion.div key={step.number} variants={fadeInUp} className="relative">
              <BrutalCard hoverable className="relative pt-10 sm:pt-12">
                {/* Step number circle */}
                <div className="absolute top-0 left-4 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent border-brutal text-black font-black text-xl sm:text-2xl flex items-center justify-center z-10">
                  {step.number}
                </div>

                {/* Step icon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-black flex items-center justify-center bg-gray-50">
                  <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg sm:text-xl mt-3 sm:mt-4">
                  {step.title}
                </h3>

                {/* Inline code block */}
                <div className="bg-gray-950 text-accent font-mono text-xs sm:text-sm px-3 py-2 mt-2 sm:mt-3 border-2 border-black overflow-x-auto">
                  {step.code}
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3 leading-relaxed">
                  {step.description}
                </p>
              </BrutalCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
