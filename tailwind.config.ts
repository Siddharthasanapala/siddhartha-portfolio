import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // Nav breakpoint per Build Spec §4 (desktop horizontal nav vs. mobile hamburger).
        nav: "900px",
      },
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-elevated-2": "var(--bg-elevated-2)",
        border: "var(--border)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        "accent-warn": "var(--accent-warn)",
        success: "var(--success)",
        "on-accent": "var(--on-accent)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        h1: "clamp(2rem, 6.5vw, 5.5rem)",
        h2: "clamp(1.75rem, 4vw, 3rem)",
        h3: "clamp(1.125rem, 2vw, 1.5rem)",
        body: "clamp(0.95rem, 1.1vw, 1.05rem)",
      },
      borderRadius: {
        xl: "12px",
        lg: "8px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
};

export default config;
