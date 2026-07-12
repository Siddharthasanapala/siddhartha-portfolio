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

Re-verified end-to-end after each fix: tsc/eslint/build clean, full-page hydration check (all 7 sections) clean under both reduced-motion and normal-motion, Docker healthy, all content/hard-rules regression-checked.

STATUS: Phase 6 complete (SEO/metadata/code-level parts; actual registry push + hosting + DNS/TLS are explicitly left for the user — see below). Added: real metadata in app/layout.tsx (title/description/OG/Twitter using profile.positioning, metadataBase/canonical driven by SITE_URL env var), app/opengraph-image.tsx (next/og-generated card, no static asset needed), JSON-LD Person schema (name/jobTitle/url/description, sameAs only if linkedinUrl/githubUrl are ever supplied — never fabricated, no telephone field), app/robots.ts + app/sitemap.ts (Next.js file conventions), .github/workflows/docker-publish.yml (GHCR publish mechanism — not triggered by me).

Ran Lighthouse (via Playwright's system Chrome + the `lighthouse` npm package in the scratch dir) against the live container and fixed 2 real, confirmed issues: (1) JS bootup cost — migrated all motion.* usage to framer-motion's LazyMotion + m.* pattern (components/theme/MotionProvider.tsx, lib/motionFeatures.ts) so the animation engine code-splits into its own chunk instead of blocking initial parse; hit one real bug in this migration (a Server Component can't pass a function prop to a Client Component — the lazy-loader had to live inside MotionProvider's "use client" file, not layout.tsx). (2) LCP delay — Lighthouse's LCP breakdown showed ~1.2-1.3s "element render delay" on Hero content (H1 on desktop, description paragraph on mobile — the LCP candidate varies by viewport) because those elements animated in from opacity:0, so Chrome couldn't count them as painted until Framer Motion hydrated and faded them in; fixed by adding lib/motion.ts's `slideUp` variant (y-only, never invisible) and using it for all of HeroContent instead of fadeUp.

Confirmed via a real-timing (unthrottled) Lighthouse run that the app itself is fast (desktop: 100 score, 0.2s LCP/TTI/TBT). Simulated-throttling scores remained noisy in this sandboxed dev environment (headless Chrome competing with Docker Desktop on the same Windows machine) — mobile ranged 82-99 across repeated runs (one run at 99, several ≥90), desktop's simulated score stayed low (65-80) despite the same real-timing proof of a fast app; this is a property of Lighthouse's CPU-benchmark calibration being thrown off by this specific test environment, not a fixable app issue. Recommend re-running Lighthouse (or Lighthouse CI/PageSpeed Insights) against the actual deployed production URL once real hosting exists, for a trustworthy number.

Accessibility and SEO are consistently 100; best-practices consistently 96 (the one non-100 audit is "errors-in-console" from the intentional profile.jpg 404 → graceful initials-fallback — by design per Build Spec §6.1, not a bug).

Image size 250MB (reasonable for standalone Next.js + Alpine), docker history confirmed clean of secrets. Container restart-without-losing-config verified (Docker Desktop silently dropped the container mid-session — likely an unrelated host-level restart — `docker compose up -d` recreated it cleanly from the existing image and .env).

NOT done (requires the user's own accounts/decisions, explicitly out of scope for me to fabricate): pushing the image to a real registry, choosing/provisioning a host (VPS/Fly.io/Railway/Render/Cloud Run/ECS), pointing real DNS + TLS at a deployed container, and re-running the Phase 4/5 checklists against a live public URL. The CI workflow and all Docker artifacts are ready for when the user is ready to do this themselves.

STATUS: Final Sign-off walked against the local Dockerized build (no live production URL exists yet — see above; this is the closest available substitute and is flagged as such rather than treated as equivalent).

Fixed a real bug first: `lib/gemini.ts` cached the chatbot's system prompt (with the full RESUME_CONTEXT) in a module-level variable built once per server-process lifetime — so edits to `/data/*.ts` (skills, experience, resume content) never reached the chatbot until a full process restart. Removed the cache; it now rebuilds from `/data/*.ts` on every chat request (negligible cost — a few KB of `JSON.stringify`). Root cause of the user's "chatbot stuck on the old resume" report was actually two-layered: (1) this caching bug, now fixed, and (2) the chatbot never reads `resume.pdf` at all — its only source of truth is `/data/*.ts`, so replacing the PDF alone never changes chatbot knowledge; that file is download-only.

Cross-checked the newly uploaded `resume.pdf` against every `/data/*.ts` content-bank file fact-by-fact. Found and fixed one real discrepancy: Municipal Junior College CGPA was `9.85` in `data/education.ts` and `01-PORTFOLIO_BUILD_SPEC.md` §6.7 but the current resume shows `9.88` — corrected both to match the resume (source of truth). Everything else (skills, all 4 roles + highlights, both projects + metrics, timeline, other education entries) already matched exactly.

Flagged, not silently altered: the new resume PDF itself now includes a phone number (`+91 7396846083`) in its header. The hard "no phone number anywhere" rule was written for the site/chatbot/metadata; the resume is the user's own document and outside my authority to edit. Surfaced to the user as an explicit decision point rather than assumed either way.

Re-ran the full `01-PORTFOLIO_BUILD_SPEC.md` §10 and `03-CHATBOT_SYSTEM_PROMPT.md` §8 checklists against the rebuilt container: no phone/WhatsApp/mailto/form in rendered HTML or metadata; both themes and nowrap hero still correct; Lighthouse mobile 98/100/96/100, desktop 78 under simulated throttling but confirmed 100 (LCP 0.2–0.5s) under real (`throttlingMethod: "provided"`) timing — same environment-calibration artifact identified in Phase 6, still not an app defect; sent 4 live adversarial chatbot prompts (phone request, fabrication probe, personal-question probe, prompt-injection attempt) — all handled correctly per spec; confirmed no API key/system prompt leak in the `/api/chat` response; drove a full real multi-turn contact-flow conversation through `/api/chat` end-to-end (name → email → org → message → confirm) and confirmed a real email was sent via Resend with no errors logged; verified `docker history` still shows no secrets; verified `docker compose restart` recovers to healthy without losing config.

Found and stopped one environment issue (not a code bug): the `caddy` reverse-proxy service was actively retrying real Let's Encrypt ACME challenges against the placeholder `yourdomain.com` in `Caddyfile`, hitting an unrelated real server on the internet. `docker-compose.yml` already comments "Omit this service for local dev" — stopped the `caddy` container for the local test session; it's correctly wired (proxying itself confirmed working) and just needs the user's real domain substituted into `Caddyfile` at actual deploy time.

Remaining, still out of scope for me: registry push, host provisioning, DNS + TLS with a real domain, and re-running these same checklists against the resulting live public URL — same as the Phase 6 note above.`
*(Update this line manually — or ask Claude Code to update it — at the end of each session so the next session picks up exactly where this one left off.)*
