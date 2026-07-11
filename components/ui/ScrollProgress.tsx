"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin progress bar tracking scroll position, pinned above the sticky nav. */
export function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: shouldReduceMotion ? 1000 : 300,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-0.5 w-full origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
