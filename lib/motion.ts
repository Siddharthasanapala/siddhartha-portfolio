import type { Transition, Variants } from "framer-motion";

/** Shared easing curve for entrance animations (Build Spec §5). */
export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

/** Fade + rise entrance pattern, triggered via whileInView. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

/** Reduced-motion-safe variant: keeps the opacity fade, drops the transform. */
export const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

/** Parent container for staggered lists (skills tags, cards, timeline items). */
export function staggerContainer(staggerChildren = 0.1): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren },
    },
  };
}

/** whileInView viewport config used with fadeUp/fadeUpReduced. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

/** Card hover micro-interaction: lift + shadow. */
export const hoverLift = {
  y: -4,
  transition: { type: "spring", stiffness: 300, damping: 20 } satisfies Transition,
};

/** Button/interactive-element hover micro-interaction. */
export const hoverScale = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 300, damping: 20 } satisfies Transition,
};
