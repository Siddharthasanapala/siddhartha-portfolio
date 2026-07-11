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
`STATUS: Phase 4 complete and verified end-to-end in Docker against real credentials. Post-Phase-4 user bug report fixed: (1) Skills reordered so Backend Engineering is last, matching Experience's DevOps-forward-first convention; (2) Skills card/tag alignment fixed (Reveal wrapper wasn't stretching to grid row height); (3) data/skills.ts, experience.ts, projects.ts deepened against a fresh read of the actual resume PDF (added SAST/DAST/Render/Supabase/Vercel tags, RDS, LoadBalancer/HPA detail, pytest/Bandit, multi-user-types detail, split Helm/private-subnet bullets); (4) chatbot latency cut from 6-15s to ~1-2s by switching lib/gemini.ts to "gemini-flash-lite-latest" + disabling thinkingConfig (measured directly against the real key) + compact (non-pretty-printed) RESUME_CONTEXT JSON + memoizing the system prompt per process lifetime; (5) ChatMessage now renders **bold**/bullet markdown instead of showing raw asterisks. All re-verified against real Gemini/Resend credentials in Docker (grounding, refusals, full contact-flow function-calling all still correct at the faster model). Ready to start Phase 5 (Responsiveness & Cross-Browser QA).`
*(Update this line manually — or ask Claude Code to update it — at the end of each session so the next session picks up exactly where this one left off.)*
