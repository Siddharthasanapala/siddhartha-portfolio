"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// Source of truth is the <html> class the blocking init script already set
// before hydration — reading it here (instead of localStorage) guarantees
// this matches what was actually painted.
function getSnapshot(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("light") ? "dark" : "light";
    document.documentElement.classList.toggle("light", next === "light");
    window.localStorage.setItem(STORAGE_KEY, next);
    // "storage" only fires in other tabs natively; dispatch it here so this
    // tab's useSyncExternalStore subscribers also pick up the change.
    window.dispatchEvent(new Event("storage"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

/**
 * Inline, render-blocking script string. Injected as a raw <script> tag in
 * <head> (before hydration) so the stored theme class is applied before
 * first paint — prevents a flash of the wrong theme on load.
 */
export const themeInitScript = `(function(){try{var t=window.localStorage.getItem('${STORAGE_KEY}');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`;
