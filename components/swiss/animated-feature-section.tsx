"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./section";
import { AnimatedHeadline } from "./animated-headline";
import { CTAButton } from "./cta-button";
import {
  sectionContainerVariants,
  numberVariants,
  dividerVariants,
  listContainerVariants,
  listItemVariants,
  ctaVariants,
} from "@/lib/motion/section-variants";

type AnimatedFeatureSectionProps = {
  background?: "default" | "orange" | "purple-gradient" | "dark";
  number?: string;
  headline: string;
  features: string[];
  featureColumns?: 2 | 3;
  ctaText: string;
  ctaHref: string;
  ctaVariant?: "primary" | "secondary" | "outline";
};

export function AnimatedFeatureSection({
  background = "default",
  number,
  headline,
  features,
  featureColumns = 2,
  ctaText,
  ctaHref,
  ctaVariant = "primary",
}: AnimatedFeatureSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Static render for reduced motion
  if (shouldReduceMotion) {
    return (
      <Section background={background} number={number}>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <AnimatedHeadline text={headline} size="lg" as="h2" trigger="mount" />
            <div className="border-t border-current/20 pt-6 mt-12">
              <div className={featureColumns === 3 ? "grid grid-cols-1 sm:grid-cols-3 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                {features.map((f) => (
                  <p key={f} className="square-bullet text-base">{f}</p>
                ))}
              </div>
            </div>
            <div className="mt-12">
              <CTAButton href={ctaHref} variant={ctaVariant}>{ctaText}</CTAButton>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section background={background}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
        variants={sectionContainerVariants}
        className="grid grid-cols-12 gap-8 relative"
      >
        {/* Section number */}
        {number && (
          <motion.span
            variants={numberVariants}
            className="absolute font-light leading-none select-none pointer-events-none bottom-0 right-0 text-6xl lg:text-[length:var(--font-size-section-number)] lg:top-0 lg:right-4 lg:bottom-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {number}
          </motion.span>
        )}

        <div className="col-span-12 lg:col-span-7">
          {/* Headline — word-by-word, triggered by parent's whileInView */}
          <AnimatedHeadline
            text={headline}
            size="lg"
            as="h2"
            trigger="inView"
            delay={100}
            stagger={0.05}
            wordDuration={0.4}
          />

          {/* Divider line — draws left to right */}
          <motion.div
            variants={dividerVariants}
            className="border-t border-current/20 mt-12 origin-left"
          />

          {/* Feature list — staggered fade */}
          <motion.div
            variants={listContainerVariants}
            className={`pt-6 ${featureColumns === 3 ? "grid grid-cols-1 sm:grid-cols-3 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}`}
          >
            {features.map((feature) => (
              <motion.p
                key={feature}
                variants={listItemVariants}
                className="square-bullet text-base"
              >
                {feature}
              </motion.p>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={ctaVariants} className="mt-12">
            <CTAButton href={ctaHref} variant={ctaVariant}>{ctaText}</CTAButton>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  );
}
