/** Decorative, CSS-only animated gradient — no JS cost, disabled under prefers-reduced-motion. */
export function HeroBackground() {
  return <div aria-hidden="true" className="hero-gradient pointer-events-none absolute inset-0 -z-10" />;
}
