"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedHeadlineProps = {
  text: string;
  size?: "xl" | "lg" | "md";
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
  stagger?: number;
  wordDuration?: number;
  trigger?: "mount" | "inView";
};

const sizeMap = {
  xl: "var(--font-size-display-xl)",
  lg: "var(--font-size-display-lg)",
  md: "var(--font-size-display-md)",
};

const trackingMap = {
  xl: "-0.04em",
  lg: "-0.03em",
  md: "-0.02em",
};

const leadingMap = {
  xl: "0.95",
  lg: "1",
  md: "1.05",
};

const containerVariants = {
  hidden: {},
  visible: (custom: { delay: number; stagger: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay / 1000,
    },
  }),
};

const makeWordVariants = (duration: number) => ({
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
});

export function AnimatedHeadline({
  text,
  size = "lg",
  as: Tag = "h1",
  className = "",
  delay = 0,
  stagger = 0.06,
  wordDuration = 0.55,
  trigger = "mount",
}: AnimatedHeadlineProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");
  const wordVariants = makeWordVariants(wordDuration);

  const style = {
    fontSize: sizeMap[size],
    letterSpacing: trackingMap[size],
    lineHeight: leadingMap[size],
    fontFamily: "var(--font-display)",
  };

  if (shouldReduceMotion) {
    return (
      <Tag className={`font-normal ${className}`} style={style}>
        {text}
      </Tag>
    );
  }

  const MotionTag = motion.create(Tag);

  const motionProps =
    trigger === "inView"
      ? {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, margin: "-20%" },
        }
      : {
          initial: "hidden" as const,
          animate: "visible" as const,
        };

  return (
    <MotionTag
      className={`font-normal ${className}`}
      style={style}
      variants={containerVariants}
      custom={{ delay, stagger }}
      {...motionProps}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          className="inline-block"
          style={{ marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
