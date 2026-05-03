"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedHeadline } from "./animated-headline";
import { DotPattern } from "./dot-pattern";
import { CTAButton } from "./cta-button";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Dot pattern background with ripple effect */}
      <div className="absolute inset-0 z-0">
        <DotPattern variant="hero" />
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-8 lg:px-12 grid grid-cols-12 gap-8 relative z-10 w-full">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">
          <AnimatedHeadline
            text="Sell directly. Skip the broker."
            size="xl"
            as="h1"
          />

          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease }}
            className="text-xl text-[var(--color-muted-foreground)] max-w-[700px]"
          >
            Australia&apos;s marketplace for buying and selling small businesses, with built-in valuations powered by real transaction data.
          </motion.p>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.3, ease }}
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
