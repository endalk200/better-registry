"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  landingCtaDecorativeSquares,
  landingHeroInstallCommand,
} from "@/lib/landing/content";
import { fadeInUp, scrollTrigger } from "@/lib/motion";

export function CTA() {
  return (
    <section className="bg-black py-20 sm:py-32 relative overflow-hidden">
      {landingCtaDecorativeSquares.map((sq, i) => (
        <div
          key={i}
          className="absolute bg-accent"
          style={{
            width: sq.size,
            height: sq.size,
            top: sq.top,
            bottom: sq.bottom,
            left: sq.left,
            right: sq.right,
            transform: `rotate(${sq.rotate}deg)`,
            opacity: sq.opacity,
            animation: `float 4s ease-in-out infinite`,
            animationDelay: sq.delay,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="text-3xl sm:text-4xl lg:text-[3.5rem] font-black text-white leading-tight"
        >
          Stop building AI tools
          <br />
          <span className="text-accent">from scratch.</span>
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.15 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="text-base sm:text-lg lg:text-xl text-gray-400 mt-4 sm:mt-6 max-w-2xl mx-auto"
        >
          Install. Customize. Ship. The registry is open source and growing.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10"
        >
          <BrutalButton variant="primary" size="lg" href="#">
            Get Started
          </BrutalButton>
          <BrutalButton
            variant="secondary"
            size="lg"
            href="https://github.com"
            icon={<Github className="w-5 h-5" />}
          >
            Star on GitHub
          </BrutalButton>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.45 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTrigger}
          className="mt-10 sm:mt-14 inline-block"
        >
          <div
            className="bg-gray-950 border-2 sm:border-3 border-accent px-4 sm:px-6 py-3 shadow-brutal-accent"
            style={{ transform: "rotate(1deg)" }}
          >
            <p className="font-mono text-xs sm:text-sm text-gray-300">
              $ {landingHeroInstallCommand}
              <span
                className="ml-1 inline-block w-2 h-4 bg-accent align-middle"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
