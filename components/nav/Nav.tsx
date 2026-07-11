"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#principles", label: "Principles" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#timeline", label: "Timeline" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header
      className={`sticky top-0 z-50 ${
        scrolled
          ? "border-b border-border bg-bg-elevated"
          : "border-b border-transparent bg-bg-elevated/70 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-end gap-6 px-[clamp(20px,5vw,64px)] py-4">
        <nav className="hidden nav:mr-auto nav:flex nav:items-center nav:gap-8" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-body text-text-muted hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden nav:block">
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text nav:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="nav:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={close}
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm"
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xs flex-col gap-8 bg-bg-elevated p-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-h3 font-bold">Menu</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-5" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="font-display text-h3 font-bold text-text"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
