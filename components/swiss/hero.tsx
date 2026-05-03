"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedHeadline } from "./animated-headline";
import { BackgroundBreath } from "./background-breath";
import { CTAButton } from "./cta-button";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      <BackgroundBreath variant="warm" />

      <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12 py-[var(--spacing-section)] grid grid-cols-12 gap-8 relative z-10">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <AnimatedHeadline
            text="Sell your business directly to qualified buyers."
            size="xl"
            as="h1"
          />

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4, ease }}
            className="text-xl text-[var(--color-muted-foreground)] max-w-[540px]"
          >
            Skip the broker fees. Get a real valuation, list confidentially, and connect with verified Australian buyers — all in one place.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.3, ease }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <CTAButton href="/valuation">Value your business</CTAButton>
            <CTAButton href="/listings" variant="outline">Browse listings</CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
