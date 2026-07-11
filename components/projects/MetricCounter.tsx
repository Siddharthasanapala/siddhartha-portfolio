"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const METRIC_PATTERN = /^(\d+)([%+]?)\s*(.*)$/;

/** Animates the leading number in a metric string (e.g. "100+ concurrent users") counting up once in view. */
export function MetricCounter({ text }: { text: string }) {
  const match = text.match(METRIC_PATTERN);
  // Extracted as stable primitives — `match` itself is a fresh array on every
  // render, which as an effect dependency caused the animation to restart on
  // every onUpdate-triggered re-render, resetting the counter back to 0.
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";
  const description = match ? match[3] : "";

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (target === null || !isInView || shouldReduceMotion) return;

    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => setAnimatedValue(Math.round(value)),
    });
    return () => controls.stop();
  }, [isInView, target, shouldReduceMotion]);

  if (target === null) {
    return <div ref={ref}>{text}</div>;
  }

  const displayValue = shouldReduceMotion ? (isInView ? target : 0) : animatedValue;

  return (
    <div ref={ref}>
      <span className="font-display text-h3 font-bold text-accent-2">
        {displayValue}
        {suffix}
      </span>
      {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
    </div>
  );
}
