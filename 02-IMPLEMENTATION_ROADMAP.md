# IMPLEMENTATION ROADMAP
Execute in this order. Do not start a phase until the previous phase's acceptance criteria pass. This roadmap references `01-PORTFOLIO_BUILD_SPEC.md`, `03-CHATBOT_SYSTEM_PROMPT.md`, and `04-DOCKER_DEPLOYMENT.md` — read all three fully before Phase 0.

---

## Phase 0 — Project Setup
**Tasks**
- `create-next-app` with TypeScript, App Router, Tailwind, ESLint enabled.
- Install: `framer-motion`, `lucide-react`, `@google/generative-ai` (Gemini SDK), an email SDK (`resend` recommended), `zod` (input validation).
- Set up `next/font` for Space Grotesk, Inter, JetBrains Mono.
- Create `.env.local.example` documenting `GEMINI_API_KEY`, `RESEND_API_KEY` (or SMTP vars), `CONTACT_EMAIL`.
- Configure `tailwind.config.ts` with the exact color tokens from Build Spec §3.1 and the type scale from §3.2.
- Set up folder structure exactly as in Build Spec §8.
- Add `Dockerfile`, `.dockerignore`, `docker-compose.yml`, and `.env.example` per `04-DOCKER_DEPLOYMENT.md`; set `output: 'standalone'` in `next.config.ts` now so the app is Docker-ready from day one, not bolted on at the end.
- Confirm `docker build` succeeds on the empty scaffold before writing any feature code — catching Docker issues early is cheaper than debugging them in Phase 6.

**Acceptance:** app boots on `pnpm dev`, Tailwind tokens resolve, fonts load with no FOIT/FOUC, TypeScript strict mode has zero errors on the empty scaffold, and `docker build -t portfolio:dev .` completes successfully with a runnable container (`docker run -p 3000:3000 portfolio:dev`).

---

## Phase 1 — Design System & Theming
**Tasks**
- Build `ThemeProvider` (React context) + `ThemeToggle` component; persist choice in `localStorage`; default dark; no flash-of-wrong-theme on load (use a blocking inline script or `next-themes`-style approach).
- Build shared UI primitives in `/components/ui`: `Section`, `Card`, `Badge`, `Button`, `Container`.
- Build `/lib/motion.ts` with shared Framer Motion variants (fadeUp, staggerContainer, hoverLift) per Build Spec §5.
- Verify both themes against every color token, check contrast with a contrast-checker tool.

**Acceptance:** toggling theme instantly swaps all tokens site-wide, no unstyled flashes, contrast passes AA in both themes on a blank page with sample text/buttons.

---

## Phase 2 — Static Content Sections (no animation yet, no chatbot yet)
Build in this order, each as its own component reading from `/data/*.ts` (populate data files from Build Spec §6 first):

1. **Nav** — desktop horizontal + mobile hamburger/overlay (Build Spec §4). Test open/close via mouse, touch, keyboard, `Esc`.
2. **Hero** — photo (with initials-fallback), greeting, name (nowrap fluid sizing per §3.3), typing-effect subtitle, short description, dual CTA buttons.
3. **Engineering Principles** — 6-card grid from §6.2.
4. **Skills** — 4 capability-framed categories from §6.3, each with a one-line "what I build" sentence + tag list.
5. **Experience** — 4 roles in the specified order (§6.4), vertical timeline layout.
6. **Projects** — 2 projects (§6.5): RaktaPraptih featured/full-width with metrics, then the CI/CD pipeline project with an architecture-step visual.
7. **Timeline** — 5-entry engineering growth timeline (§6.6).
8. **Education** — 3 entries (§6.7). **Certifications** — conditionally rendered, hidden by default (§6.8).
9. **Contact** — headline + email (text only) + LinkedIn/GitHub + chat launcher placeholder (functional chatbot comes in Phase 4).
10. **Footer** — email, socials, copyright, no phone/WhatsApp anywhere.

**Acceptance:** every section renders real content from `/data`, matches Build Spec §6 exactly, page is a complete (if unanimated, single-theme-tested) portfolio top to bottom.

---

## Phase 3 — Motion Pass
**Tasks**
- Apply entrance animations (`whileInView`) to every section per §5.
- Apply stagger to list-like groups (skills tags, principle cards, timeline items, project cards).
- Add hero-specific animations (typing effect, background grid/gradient motion).
- Add hover micro-interactions to cards/buttons/nav links.
- Wrap all motion in a `prefers-reduced-motion` check.

**Acceptance:** scroll through the whole page — every section animates in once, no jank, no layout shift caused by animation; toggling OS-level reduced-motion measurably reduces animation.

---

## Phase 4 — Chatbot (Full Build)
Follow `03-CHATBOT_SYSTEM_PROMPT.md` precisely.

**Tasks**
1. Build `/api/chat/route.ts`: accepts message history, injects system prompt + live `RESUME_CONTEXT` (serialized from `/data`), calls Gemini at low temperature, returns response. Add input sanitation + rate limiting (§3 of chatbot spec).
2. Build `/api/contact/route.ts`: validates payload (zod schema: name, email, org?, message), honeypot field, rate limiting, sends email via Resend/SMTP to `CONTACT_EMAIL`.
3. Build `ChatWidget`, `ChatLauncher`, `ChatMessage` components per §4 of chatbot spec: launcher, panel, opening message, quick-reply chips, typing indicator, accessible focus trap.
4. Wire the "leave a message" conversational flow to call `/api/contact` only after visitor confirmation, per chatbot spec §2 CONTACT FLOW.
5. Implement graceful degradation UI for Gemini failures/quota errors (chatbot spec §7.4).

**Acceptance:** run every scenario in chatbot spec §6 (allowed + refused) manually and confirm the bot behaves correctly in all of them; send a real test message end-to-end and confirm the email arrives; confirm no API key/system prompt ever appears in browser dev tools network tab.

---

## Phase 5 — Responsiveness & Cross-Browser QA
**Tasks**
- Test at 360px, 390px, 768px, 1024px, 1440px, 1920px — check nav, hero name wrapping, card grids, chat widget sizing.
- Test in Chrome, Firefox, Safari (desktop + iOS), Edge.
- Test keyboard-only navigation through nav, sections, and chatbot.
- Test with a screen reader (VoiceOver/NVDA) on nav and chatbot at minimum.
- Test both themes at every breakpoint.

**Acceptance:** no horizontal scroll, no clipped/overlapping text, no broken layouts anywhere in the matrix above; chatbot widget usable on mobile without covering critical content unreachably.

---

## Phase 6 — SEO, Performance, Dockerized Deploy
**Tasks**
- Add metadata, OpenGraph/Twitter cards, JSON-LD `Person` schema (no telephone field) per Build Spec §9.
- Run Lighthouse (mobile + desktop) against the container running locally (`docker run`); fix anything under 90 in any category.
- Verify `robots.txt` / `sitemap.xml` generation inside the containerized build.
- Finalize `Dockerfile`/`docker-compose.yml`/reverse-proxy config per `04-DOCKER_DEPLOYMENT.md` — confirm image size is reasonable (check with `docker images`), confirm no secrets are baked in (`docker history <image>` should show no API keys).
- Set real runtime environment variables (`GEMINI_API_KEY`, email provider key, `CONTACT_EMAIL`) on the host (`.env` file not committed, or the host/orchestrator's secret store) — never in the image.
- Build and push the production image to your chosen registry (Docker Hub / GHCR), then deploy the container to your chosen host (VPS, Fly.io, Railway, Render, Cloud Run, ECS, etc. — see `04-DOCKER_DEPLOYMENT.md` §7 for options).
- Point DNS + TLS (via the reverse proxy in `04-DOCKER_DEPLOYMENT.md`) at the deployed container.
- Re-run the full Phase 4 + Phase 5 checklists against the live deployed URL.

**Acceptance:** live URL passes Lighthouse ≥90 across all categories on mobile and desktop, chatbot works against the deployed container, contact email delivery confirmed in production, container restarts cleanly (`docker compose restart`) without losing config, all items in Build Spec §10 Acceptance Checklist are checked off.

---

## Final Sign-off
Before calling this "done," walk `01-PORTFOLIO_BUILD_SPEC.md` §10 checklist and `03-CHATBOT_SYSTEM_PROMPT.md` §8 checklist top to bottom against the live production site. Anything unchecked blocks launch.
