import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Framer Motion's useReducedMotion() resolves the real client value
 * synchronously on the client's first render, which differs from SSR's
 * default and causes hydration mismatches for anything that affects
 * *rendered output* (not just animation config, which MotionConfig already
 * handles safely — see app/layout.tsx). Use this instead whenever a
 * reduced-motion check changes what gets rendered, not just how it animates.
 */
export function useIsReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
