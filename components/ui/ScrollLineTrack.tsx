"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll } from "framer-motion";
import { useIsReducedMotion } from "@/lib/useIsReducedMotion";

interface ScrollLineTrackProps {
  children: ReactNode;
  className?: string;
  lineClassName?: string;
}

/** Draws an accent line down the left edge as the user scrolls through the wrapped content. */
export function ScrollLineTrack({
  children,
  className = "",
  lineClassName = "bg-accent",
}: ScrollLineTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useIsReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.6"],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className={`absolute left-0 top-0 w-px origin-top ${lineClassName}`}
          style={{ scaleY: scrollYProgress, height: "100%" }}
        />
      )}
      {children}
    </div>
  );
}
