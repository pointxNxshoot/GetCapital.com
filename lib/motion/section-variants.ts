// Shared Framer Motion variants for scroll-triggered section animations.
// All three feature sections use identical timing.

export const sectionContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
    },
  },
};

// Section number: pure opacity fade, 600ms
export const numberVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.2,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// Divider line: scaleX from left, 600ms, starts after headline (~600ms delay)
export const dividerVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      delay: 0.6,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  },
};

// Feature list container: staggers children after divider completes
export const listContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 1.2,
    },
  },
};

// Individual feature item
export const listItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// CTA button: fades in last
export const ctaVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 1.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
