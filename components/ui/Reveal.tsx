"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Scroll-triggered fade + rise entrance for a section-level block (Build
 * Spec §5). Always renders the same variant on server and client — the app
 * is wrapped in <MotionConfig reducedMotion="user"> (app/layout.tsx), which
 * disables the transform at the animation-engine level for reduced-motion
 * users instead of us branching per-component (which caused a server/client
 * hydration mismatch, since only the client knows the OS motion preference).
 */
export function Reveal({ children, className }: RevealProps) {
  return (
    <m.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </m.div>
  );
}
