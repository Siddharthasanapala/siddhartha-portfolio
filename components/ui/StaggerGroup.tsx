"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, viewportOnce } from "@/lib/motion";

const TAGS = {
  div: motion.div,
  ol: motion.ol,
  ul: motion.ul,
} as const;

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: keyof typeof TAGS;
}

/** Parent container for staggered lists (skills tags, principle cards, timeline items, project cards). */
export function StaggerGroup({ children, className, stagger = 0.1, as = "div" }: StaggerGroupProps) {
  const MotionTag = TAGS[as];

  return (
    <MotionTag
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}
