"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Defined inside a Client Component so the function reference never has to
// cross the Server->Client props boundary (Next.js can't serialize a plain
// function passed as a prop from a Server Component — this must be a local
// value inside client-only code instead).
const loadMotionFeatures = () => import("@/lib/motionFeatures").then((mod) => mod.default);

/**
 * Code-splits the framer-motion feature bundle into its own chunk instead of
 * bundling it into the initial JS parsed before first paint (Lighthouse
 * flagged ~800ms of main-thread bootup time from motion's default bundle).
 * reducedMotion="user" makes every motion component respect the OS
 * prefers-reduced-motion setting at the animation-engine level, so
 * components render the same variants/styles on server and client.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
