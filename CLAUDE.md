# CLAUDE.md — Project Memory (auto-loaded by Claude Code)

## What this project is
Siddhartha Sanapala's personal portfolio — Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion, with a Gemini-powered chatbot, deployed as a Docker container.

## Required reading before writing any code
Read these four files in full, in this order, before starting or resuming work. They are binding, not suggestions:
1. `01-PORTFOLIO_BUILD_SPEC.md` — design system, content, hard rules
2. `02-IMPLEMENTATION_ROADMAP.md` — the phase-by-phase build order
3. `03-CHATBOT_SYSTEM_PROMPT.md` — chatbot behavior spec
4. `04-DOCKER_DEPLOYMENT.md` — deployment target and container setup

## Hard rules (violating any of these is a bug, not a style choice)
- Only an email address is ever shown as contact info. **No phone number, no WhatsApp, anywhere** — including metadata/JSON-LD.
- No direct mailto/contact form. The chatbot's "leave a message" flow is the only way a visitor can message Siddhartha.
- Two themes only (dark default, light), token-driven, no ad-hoc colors.
- Every fact about Siddhartha must trace to the Content Bank in `01-PORTFOLIO_BUILD_SPEC.md §6` or the resume — never invent skills, dates, employers, or metrics.
- Chatbot only discusses Siddhartha's professional profile; system prompt in `03-CHATBOT_SYSTEM_PROMPT.md §2` must be sent verbatim with live data injected.
- No secrets in client code or baked into the Docker image — runtime env vars only.
- Fully responsive (360px→1920px), no mid-word text wrapping on headlines, hamburger nav below 900px.
- Deployment artifact is a Docker image (`output: 'standalone'` in `next.config.ts`) — not Vercel-specific code.

## How to work in this repo
- Follow `02-IMPLEMENTATION_ROADMAP.md` phase by phase. Don't start Phase N+1 until Phase N's acceptance criteria (listed at the end of each phase) all pass.
- Before generating a section's content or copy, check `01-PORTFOLIO_BUILD_SPEC.md §6` (Content Bank) — reuse it, don't paraphrase away specifics.
- If a spec file is silent on something, stop and ask rather than improvising — note the gap instead of guessing.
- Prefer small, reviewable commits aligned to roadmap phases/tasks over one giant commit.
- After each phase, run through that phase's acceptance checklist explicitly before moving on, and report which items pass/fail.

## Current status
`STATUS: Phase 5 complete (see prior entry, preserved in git history/session log). Post-Phase-5 user feedback addressed: "light theme unusable, too static/low animation, needs more professional interactivity."

Light theme fix: bg/bg-elevated were only ~1.02:1 apart (cards invisible against page) — retuned bg/bg-elevated-2/border to ~1.10-1.36:1 separation, re-verified all text/accent contrast still AA-passing, added a persistent subtle Card shadow.

New interactivity (all reduced-motion-aware): scroll-spy nav with animated sliding underline (desktop) + slide-in mobile panel; smooth scroll with scroll-margin offset for the sticky header; a top scroll-progress bar; animated counting metrics on Projects (100+/30%/95%/100%); richer hover micro-interactions on principle icons and tag badges; a scroll-linked accent line that draws down Timeline/Experience as you scroll (components/ui/ScrollLineTrack.tsx).

Found and fixed 3 real bugs during verification (all via Playwright against the live container, not just code review): (1) MetricCounter's animation reset to 0 on every frame — a fresh RegExpMatchArray object was in the useEffect dependency array, causing the effect to tear down and restart on every onUpdate-triggered re-render; fixed by extracting stable primitives (target/suffix/description) as dependencies instead. (2)+(3) Two SSR hydration mismatches from components branching on framer-motion's useReducedMotion() to alter *rendered output* (not just animation config) — that hook resolves synchronously on the client's first render, differently from SSR's default, so TypingText's displayed text and ScrollLineTrack's conditional line element diverged between server and client. Fixed by: adding app/layout.tsx's <MotionConfig reducedMotion="user"> so components can always render the *same* variant (letting Framer Motion handle reduced-motion at the animation engine level, hydration-safely) — simplified Reveal/StaggerItem/StaggerGroup/HeroContent/ThemeToggle this way, removing fadeUpReduced entirely; and for the two components where the reduced-motion check unavoidably affects rendered output/text, added lib/useIsReducedMotion.ts (a useSyncExternalStore-based hook with getServerSnapshot=false, the same hydration-safe pattern already used in ThemeProvider).

Re-verified end-to-end after each fix: tsc/eslint/build clean, full-page hydration check (all 7 sections) clean under both reduced-motion and normal-motion, Docker healthy, all content/hard-rules regression-checked. Ready to resume Phase 6 (SEO, Performance, Dockerized Deploy) whenever asked — this was ad-hoc polish work between phases, not a roadmap phase itself.`
*(Update this line manually — or ask Claude Code to update it — at the end of each session so the next session picks up exactly where this one left off.)*
