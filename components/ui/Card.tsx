import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-bg-elevated p-6 transition duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
