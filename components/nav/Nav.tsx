"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    toggleButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight whichever section crosses the vertical center band.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Esc-to-close + a focus trap while the overlay is open, matching the
  // chatbot panel's pattern — otherwise Tab escapes into Hero content that's
  // still visually covered by the overlay/backdrop.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 ${
          scrolled
            ? "border-b border-border bg-bg-elevated"
            : "border-b border-transparent bg-bg-elevated/70 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex max-w-content items-center justify-end gap-6 px-[clamp(20px,5vw,64px)] py-4">
          <nav className="hidden nav:mr-auto nav:flex nav:items-center nav:gap-8" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative pb-1 text-body transition-colors duration-200 ${
                    isActive ? "text-text" : "text-text-muted hover:text-text"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 30 }
                      }
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden nav:block">
            <ThemeToggle />
          </div>

          <button
            ref={toggleButtonRef}
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
      </header>

      {/*
       * Rendered as a sibling of <header>, not nested inside it — the header
       * conditionally applies backdrop-blur (backdrop-filter), which creates
       * a new containing block for fixed-position descendants. Nesting this
       * overlay inside header confined its "fixed" positioning to header's
       * own small bounding box instead of the viewport.
       */}
      <AnimatePresence>
        {open && (
          <div className="nav:hidden">
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm"
            />
            <motion.div
              id="mobile-nav"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              tabIndex={-1}
              initial={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-xs flex-col gap-8 bg-bg-elevated p-6 outline-none"
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
                {NAV_LINKS.map((link) => {
                  const isActive = activeId === link.href.slice(1);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      aria-current={isActive ? "true" : undefined}
                      className={`font-display text-h3 font-bold transition-colors duration-200 ${
                        isActive ? "text-accent" : "text-text"
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-auto">
                <ThemeToggle />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
