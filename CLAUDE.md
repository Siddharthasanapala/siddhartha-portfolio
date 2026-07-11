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
`STATUS: Phase 5 complete. Used Playwright driving the system's installed Chrome/Edge (not a fresh browser download) for real automated viewport/keyboard/ARIA testing against the live Docker container — found and fixed 4 real bugs: (1) Docker HEALTHCHECK used "localhost" which resolves to IPv6 first inside the container while the server only binds IPv4, so it had been reporting unhealthy since Phase 0 — fixed to 127.0.0.1 in both Dockerfile and docker-compose.yml; (2) mobile nav overlay was transparent/see-through because it was nested inside <header>, and header's conditional backdrop-blur creates a new containing block for fixed-position descendants, confining the "fixed" overlay to header's own tiny bounding box — fixed by moving the overlay to be a sibling of <header>; (3) the floating chat launcher visually overlapped the mobile chat panel's own content (both occupy the same bottom-right corner on small screens) — fixed by hiding the launcher below sm: while the panel is open (desktop's panel geometry has no such overlap, left as-is there); (4) mobile nav didn't trap focus (Tab escaped into hidden Hero content behind the overlay) and its Escape handler bypassed the close() helper so focus never returned to the hamburger button — added the same focus-trap pattern already used in ChatWidget, and fixed the Escape path. All 6 breakpoints (360-1920px) x both themes x Chrome+Edge verified with zero horizontal overflow, zero hero-name mid-word wrapping, correct nav breakpoint switching. Full keyboard-only pass and ARIA audit (landmarks, alt text, dialog roles, live regions) done via Playwright, not just code review. NOT verified in this environment (no macOS/iOS/NVDA available): real Safari/iOS Safari rendering, Firefox, and actual screen-reader software (VoiceOver/NVDA) — flagged honestly, recommend BrowserStack or a real device pass before shipping. Ready to start Phase 6 (SEO, Performance, Dockerized Deploy).`
*(Update this line manually — or ask Claude Code to update it — at the end of each session so the next session picks up exactly where this one left off.)*
