import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-20 py-[clamp(64px,10vw,140px)] ${className}`}>
      {children}
    </section>
  );
}
