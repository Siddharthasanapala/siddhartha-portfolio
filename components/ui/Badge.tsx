import type { ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "warn";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * "accent" is a solid fill (bg-accent + text-on-accent) rather than
 * colored-text-on-neutral-bg: the spec's light-theme accent value only
 * reaches ~3.7:1 against bg/bg-elevated, short of the 4.5:1 body-text AA
 * target, but clears 4.5:1+ as a fill against the dark --on-accent ink.
 * "warn" keeps colored text on a neutral bg since accent-warn already
 * clears 4.5:1 there in both themes.
 */
const variantClasses: Record<BadgeVariant, string> = {
  default: "border-border bg-bg-elevated-2 text-text-muted",
  accent: "border-transparent bg-accent text-on-accent",
  warn: "border-accent-warn/40 bg-transparent text-accent-warn",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-xs ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
