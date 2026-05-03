"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimatedHeadlineProps = {
  text: string;
  size?: "xl" | "lg" | "md";
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
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
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.06,
      delayChildren: delay / 1000,
    },
  }),
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export function AnimatedHeadline({
  text,
  size = "lg",
  as: Tag = "h1",
  className = "",
  delay = 0,
}: AnimatedHeadlineProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const style = {
    fontSize: sizeMap[size],
    letterSpacing: trackingMap[size],
    lineHeight: leadingMap[size],
    fontFamily: "var(--font-display)",
  };

  // Static render for reduced motion
  if (shouldReduceMotion) {
    return (
      <Tag className={`font-normal ${className}`} style={style}>
        {text}
      </Tag>
    );
  }

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`font-normal ${className}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
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
