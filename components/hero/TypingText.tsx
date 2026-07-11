"use client";

import { useEffect, useState } from "react";
import { useIsReducedMotion } from "@/lib/useIsReducedMotion";

const TYPE_SPEED_MS = 45;
const DELETE_SPEED_MS = 30;
const HOLD_MS = 1500;
const REDUCED_MOTION_CYCLE_MS = 2200;

interface TypingTextProps {
  phrases: string[];
}

/**
 * Cycles through `phrases` with a type/pause/delete effect (Build Spec §5).
 * With prefers-reduced-motion, skips the per-character animation and just
 * swaps the full phrase periodically; the rapidly-updating visible text is
 * aria-hidden with a single static sr-only summary instead, since a live
 * region would announce every keystroke.
 */
export function TypingText({ phrases }: TypingTextProps) {
  const shouldReduceMotion = useIsReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (shouldReduceMotion) {
      const id = setInterval(() => {
        setPhraseIndex((current) => (current + 1) % phrases.length);
      }, REDUCED_MOTION_CYCLE_MS);
      return () => clearInterval(id);
    }

    let charCount = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charCount += 1;
        setTypedText(current.slice(0, charCount));
        if (charCount === current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, HOLD_MS);
          return;
        }
        timeoutId = setTimeout(tick, TYPE_SPEED_MS);
        return;
      }

      charCount -= 1;
      setTypedText(current.slice(0, charCount));
      if (charCount === 0) {
        setPhraseIndex((current) => (current + 1) % phrases.length);
        return;
      }
      timeoutId = setTimeout(tick, DELETE_SPEED_MS);
    };

    timeoutId = setTimeout(tick, TYPE_SPEED_MS);
    return () => clearTimeout(timeoutId);
  }, [phraseIndex, shouldReduceMotion, phrases]);

  const displayText = shouldReduceMotion ? phrases[phraseIndex] : typedText;

  return (
    <div>
      <p className="font-mono text-body text-accent" aria-hidden="true">
        <span>{displayText}</span>
        {!shouldReduceMotion && (
          <span className="ml-0.5 inline-block w-[1ch] animate-pulse">|</span>
        )}
      </p>
      <span className="sr-only">{phrases.join(", ")}</span>
    </div>
  );
}
