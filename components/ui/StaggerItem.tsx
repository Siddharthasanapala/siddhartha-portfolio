"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

const TAGS = {
  div: motion.div,
  li: motion.li,
} as const;

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: keyof typeof TAGS;
}

/**
 * Child of a StaggerGroup — inherits the hidden/visible state from its
 * parent. See Reveal.tsx for why this doesn't branch on useReducedMotion()
 * itself (MotionConfig in app/layout.tsx handles it, hydration-safely).
 */
export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const MotionTag = TAGS[as];

  return (
    <MotionTag className={className} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}
