"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, fadeUpReduced } from "@/lib/motion";

const TAGS = {
  div: motion.div,
  li: motion.li,
} as const;

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: keyof typeof TAGS;
}

/** Child of a StaggerGroup — inherits the hidden/visible state from its parent. */
export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = TAGS[as];

  return (
    <MotionTag className={className} variants={shouldReduceMotion ? fadeUpReduced : fadeUp}>
      {children}
    </MotionTag>
  );
}
