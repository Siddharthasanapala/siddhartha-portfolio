# PORTFOLIO BUILD SPEC — SOURCE OF TRUTH
**Owner:** Siddhartha Sanapala · Platform / DevOps Engineer
**Doc type:** Binding specification for spec-driven development
**Status:** Final — do not deviate without explicit sign-off

---

## 0. HOW TO USE THIS DOCUMENT (READ FIRST)

This file is the **single source of truth** for the rebuild. It supersedes:
- the old `index.html` portfolio (visual/content reference only — do NOT copy its stack, only its proven content ideas),
- the resume PDF (source of factual content only).

Rules for whoever/whatever builds this (human or AI coding agent):
1. **Never invent facts.** Every claim about Siddhartha (roles, dates, tools, metrics) must come from Section 6 (Content Bank) below or the resume. If something is missing, leave a `TODO:` comment in code — do not fabricate.
2. **Never silently change the tech stack, design tokens, or section order** defined here. If a change seems necessary, stop and flag it instead of proceeding.
3. **Treat every requirement below as a hard constraint**, not a suggestion, unless explicitly marked `(optional)`.
4. Work through `02-IMPLEMENTATION_ROADMAP.md` phase by phase. Do not skip ahead.
5. Chatbot behavior is governed entirely by `03-CHATBOT_SYSTEM_PROMPT.md` — this file only covers the chat **widget UI**, not its conversational rules.

---

## 1. TECH STACK (LOCKED)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server components by default; client components only where interactivity requires it |
| Language | TypeScript (strict mode) | `"strict": true` in tsconfig, no `any` unless justified with a comment |
| Styling | Tailwind CSS | Use design tokens from Section 3, no inline magic hex values |
| Animation | Framer Motion | All motion defined in Section 5 |
| Chatbot LLM | Google Gemini (free tier) | `gemini-1.5-flash` or `gemini-2.0-flash` — server-side only, see chatbot spec |
| Email delivery | Resend or Nodemailer via SMTP (free tier) | Server-side API route only, never client-side |
| Deployment target | **Docker (containerized, self-hosted / any cloud)** | Multi-stage build, Next.js `output: 'standalone'` — see `04-DOCKER_DEPLOYMENT.md` |
| Icons | `lucide-react` | Consistent stroke-based icon set |
| Fonts | `next/font` — Space Grotesk (display), Inter (body), JetBrains Mono (code/terminal accents) | Self-hosted via next/font, no external font CDN calls |

**Package manager:** pnpm (or npm if unavailable). Lockfile committed.

---

## 2. NON-NEGOTIABLE RULES

These apply to the entire site, every section, every screen size:

1. **Two themes only:** Dark and Light. No "system-only" auto-switch without a manual override toggle. Default = Dark. Preference persisted in `localStorage`.
2. **Contact information:** Only an email address is ever displayed anywhere on the site (in the Contact section, footer, and metadata). **No phone number, no WhatsApp link, no personal social handles beyond LinkedIn/GitHub (professional).**
3. **No direct "mailto" contact form.** Visitors cannot compose and send an email directly from the site. The only way to send a message/claim/request to Siddhartha is through the chatbot's structured "leave a message" flow (see chatbot spec §5). The visible email address is for reference/verification only (e.g., in the footer, resume link), not an active send-a-message form.
4. Every section's copy must reflect the **positioning statement** below — this is the single message the whole site must communicate:

   > Instead of "Here are my skills," the site says: **"I build reliable software platforms by solving engineering problems."**

   Concretely: avoid bare tool lists. Every list of tools/skills must be framed around what Siddhartha *builds* or *solves* with them (see Section 6 for exact copy).
5. **Fully responsive**, tested at minimum breakpoints: 360px (small phone), 390px (modern phone), 768px (tablet/iPad portrait), 1024px (iPad landscape / small laptop), 1440px (laptop), 1920px (large desktop). No horizontal scroll at any width. No overlapping/clipped text at any width — headline text must scale fluidly (see Section 3.3), never wrap mid-word.
6. **Cross-browser:** must render and function correctly in latest Chrome, Firefox, Safari (incl. iOS Safari), and Edge. Avoid CSS/JS features without broad support; use autoprefixer via Tailwind's default pipeline.
7. **Accessibility (WCAG 2.1 AA target):** semantic HTML, visible focus states, `alt` text on all images, sufficient color contrast in both themes (see Section 3.1 contrast notes), keyboard-navigable nav and chatbot, `prefers-reduced-motion` respected (animations reduce/disable when set).
8. **Performance:** Lighthouse score ≥ 90 on Performance, Accessibility, Best Practices, SEO (mobile + desktop). Images optimized via `next/image`. No layout shift from font loading (use `next/font` with `display: swap`).
9. **No secrets in client code, and no secrets baked into the Docker image.** Gemini API key and email-service credentials are injected only as **runtime environment variables** on the container (via `.env` file, `docker-compose` env, or the host's secret manager) — never `ARG`/`ENV` baked in at build time, never committed to the repo. Accessed only inside API routes / server actions. See `04-DOCKER_DEPLOYMENT.md` §4.
10. **Chatbot is the only AI surface.** No other part of the site generates AI content at runtime.

---

## 3. DESIGN SYSTEM

### 3.1 Color Tokens

Define these as CSS variables (`:root` and `.light`) and mirror them in `tailwind.config.ts` under `theme.extend.colors`. Do not introduce ad-hoc colors elsewhere.

**Dark theme (default)**
```
--bg:            #0A0E12   /* page background */
--bg-elevated:   #12171D   /* cards, nav, elevated surfaces */
--bg-elevated-2: #171D24   /* nested cards / hover states */
--border:        #232B33
--text:          #E7ECF1   /* primary text */
--text-muted:    #8B97A3   /* secondary text */
--accent:        #34D399   /* primary accent — emerald (engineering/reliability) */
--accent-2:      #38BDF8   /* secondary accent — cyan (cloud/infra) */
--accent-warn:   #F59E0B   /* used sparingly — highlights, badges */
--success:       #22C55E
```

**Light theme**
```
--bg:            #FAFAF9
--bg-elevated:   #FFFFFF
--bg-elevated-2: #F1F5F4
--border:        #E2E8E6
--text:          #10151A
--text-muted:    #55636D
--accent:        #059669   /* darker emerald for AA contrast on white */
--accent-2:      #0284C7   /* darker cyan for AA contrast on white */
--accent-warn:   #B45309
--success:       #16A34A
```

Rationale (must be preserved): a desaturated slate/near-black neutral base with a single emerald "engineering" accent and a cyan "cloud/infra" secondary accent reads as senior/professional across age groups — avoid neon purples/pinks or playful gradients. Both themes must hit **WCAG AA contrast (4.5:1 body text, 3:1 large text)** against their respective backgrounds — verify accent-on-background combinations before shipping.

### 3.2 Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display / Headings | Space Grotesk | 700–800 | H1, H2, hero name |
| Body | Inter | 400–500 | Paragraphs, nav, buttons |
| Mono / Technical accents | JetBrains Mono | 400–500 | Terminal snippets, code chips, stats labels, chat bubbles' meta text |

Type scale (fluid, via Tailwind `clamp()` utilities or arbitrary values — never fixed px for headings):
- H1 (hero name): `clamp(2rem, 6.5vw, 5.5rem)`
- H2 (section title): `clamp(1.75rem, 4vw, 3rem)`
- H3 (card title): `clamp(1.125rem, 2vw, 1.5rem)`
- Body: `clamp(0.95rem, 1.1vw, 1.05rem)`

### 3.3 Fluid Text Rule (hard requirement)

Any single-word or short headline element (e.g., the name in the hero) must use `white-space: nowrap` + fluid `clamp()` sizing so it **never breaks mid-word** at any viewport — this was a real bug in the previous site and must not recur. Multi-word headlines may wrap only at word boundaries (`overflow-wrap: normal`, never `anywhere`).

### 3.4 Spacing & Radius

- Spacing scale: Tailwind default (4px base) — do not introduce a second spacing system.
- Section vertical padding: `clamp(64px, 10vw, 140px)` top/bottom.
- Card radius: `12px` (`rounded-xl`). Buttons: `8px` (`rounded-lg`).
- Max content width: `1200px`, centered, with fluid horizontal padding `clamp(20px, 5vw, 64px)`.

---

## 4. NAVIGATION & LAYOUT

- Sticky top nav, translucent/blurred background over hero, solid on scroll.
- Desktop (≥900px): horizontal link list, no logo wordmark (learned from prior feedback — keep it clean), theme toggle on the right.
- Mobile/tablet (<900px): hamburger icon → slide-in overlay panel with full-height nav links + theme toggle. Overlay dismissible via backdrop tap, close (×) button, or `Esc` key. Body scroll locked while open.
- Sections linked in nav, in this exact order: `Home` (hero) · `Principles` · `Skills` · `Experience` · `Projects` · `Timeline` · `Education` · `Contact` (chat).
- Active-section highlighting via scroll-spy (IntersectionObserver) — optional but recommended.

---

## 5. MOTION SYSTEM (Framer Motion)

Define a shared `motion.ts` (variants file) — do not scatter one-off animation configs across components.

- **Entrance pattern:** fade + rise (`opacity 0→1`, `y: 24→0`), `duration: 0.6`, `ease: [0.22, 1, 0.36, 1]`, triggered via `whileInView` with `viewport={{ once: true, margin: '-80px' }}`.
- **Stagger:** parent containers use `staggerChildren: 0.08–0.12` for lists (skills tags, principle cards, timeline items, project cards).
- **Hero:** name + tag animate in on load (not scroll-triggered); typing-effect subtitle cycling through role phrases (reuse concept from old portfolio, rewritten copy — see Section 6.1); subtle animated gradient/grid background (CSS or Framer, low-cost, must not tank Lighthouse score).
- **Hover micro-interactions:** cards lift (`y: -4px`, shadow increase), buttons scale (`1.02`) — `duration: 0.2`, spring easing.
- **Theme toggle:** icon cross-fade/rotate transition, ~0.3s.
- **Chat widget:** launcher button pulses subtly when idle (draws attention without being obnoxious — stop pulsing after first open); panel opens via scale+fade from the launcher's origin corner.
- **Reduced motion:** wrap the whole motion config so that `prefers-reduced-motion: reduce` disables non-essential motion (keep opacity fades, drop transforms/parallax).

---

## 6. CONTENT BANK (FACTUAL — DO NOT ALTER WITHOUT SOURCE)

All content below is sourced from the current resume. Use verbatim or lightly rephrased to fit each section's tone — do not add unverified numbers or claims.

### 6.0 Identity
- Name: **Siddhartha Sanapala**
- Location: Visakhapatnam, Andhra Pradesh, India
- Email: `siddharthasanapala136@gmail.com` (only contact info ever shown)
- LinkedIn / GitHub: link out, professional only
- Positioning: **Platform / DevOps Engineer** — DevOps-focused software engineer with hands-on experience across cloud-native infrastructure, CI/CD automation, Kubernetes, IaC, and observability across GCP, AWS, and Azure; backend strength in Python/Django/REST APIs.

### 6.1 Hero
- Greeting/wishing line (short, time-agnostic — do NOT hardcode "Good morning" server-rendered without client-side correction for visitor's local time, or keep it generic): e.g. *"Hey, I'm Siddhartha 👋"*
- Profile photo: `public/profile.jpg` — **placeholder until Siddhartha supplies a real headshot**; component must have a graceful fallback (initials avatar) if the image is missing.
- Short description (2–3 lines): *"I enjoy solving infrastructure, deployment and operational challenges through automation, cloud-native architectures and backend engineering. My focus is building reliable, scalable systems that simplify software delivery and improve developer productivity."*
- Typing-effect phrases: `Building Reliable Platforms…`, `Automating Cloud Infrastructure…`, `Designing CI/CD Pipelines…`, `Engineering Secure Deployments…`, `Improving Observability…`, `Building Production-Ready Systems…`
- Primary CTA: "Chat with my AI assistant" → opens chatbot. Secondary CTA: "Download Résumé" (PDF link).

### 6.2 Engineering Principles
1. **Automation First** — Reduce repetitive work through automation and Infrastructure as Code.
2. **Reliability by Design** — Build resilient systems using monitoring, redundancy and recovery.
3. **Measure Before Optimizing** — Observability guides engineering decisions (Prometheus, Grafana, Sentry).
4. **Secure by Default** — Security scanning (Trivy, Snyk, OWASP ZAP) integrated into CI/CD, not bolted on.
5. **Everything Version Controlled** — Infrastructure, deployment, configuration and application code stay reproducible.
6. **Continuous Improvement** — Every deployment, incident and bug is an opportunity to improve the platform.

### 6.3 Skills (framed as capability, not a tool list)
- **Backend Engineering** — *"Design secure REST APIs, authentication and role-based access."* → Python, Java, Django, Django REST Framework, REST APIs, JWT Authentication
- **Cloud & Infrastructure** — *"Provision infrastructure, networking and identity across cloud providers."* → GCP, AWS, Azure (Web Apps), Terraform, Ansible, VPC/IAM
- **CI/CD & DevSecOps** — *"Automate build, test and deployment pipelines with security built in."* → Docker, Kubernetes, Helm, GitHub Actions, Jenkins, Azure DevOps Pipelines, Trivy, Snyk, OWASP ZAP
- **Observability & Data** — *"Monitor systems and manage data for reliable operations."* → Prometheus, Grafana, Sentry, PostgreSQL, MySQL, MongoDB, Redis, Git, Postman, Swagger, Linux

### 6.4 Experience (order: DevOps-forward roles first, backend role last — intentional)
1. **Trainee Software Engineer**, Sails Software, *2024 – Present (full-time)*
   - Implemented cloud-native deployment workflows across AWS and Azure.
   - Built monitoring dashboards using Prometheus and Grafana (metrics, visualization, alerting).
   - Integrated DevSecOps scanning (Trivy, Snyk, OWASP ZAP) into CI/CD.
   - Deployed a production full-stack app (React.js + Python + PostgreSQL) on Azure Web Apps with restricted backend/DB network access.
   - Diagnosed deployment failures and infra incidents; applied SRE practices.
2. **SRE Intern**, Sails Software (onsite), *2024*
   - Containerized apps with Docker, deployed to GKE (deployments, services, ingress, HPA via Helm).
   - Automated infra provisioning with Terraform (IaC).
   - Refined CI/CD pipelines (Jenkins, Azure DevOps) — build caching, multi-stage Docker builds.
   - Configured K8s network policies and secure ingress/egress.
3. **AWS Intern**, Brainovision, *2023*
   - Implemented EC2, IAM, VPC, S3, ELB, Auto Scaling Groups, ECR.
   - Explored CloudWatch, Lambda, CI/CD concepts.
4. **Python Developer Intern**, Jupitos Technologies LLC, *2023*
   - Built modular REST APIs with DRF + JWT auth.
   - Serializer/viewset/auth modules with RBAC.
   - 10+ backend assignments (auth, CRUD, API design, PostgreSQL).

### 6.5 Projects (only these two — do not invent additional projects)
1. **RaktaPraptih — Blood Donation Management System** *(featured)*
   - Production Django + DRF backend, secure API-driven donor/request management. Docker, Render deploy, automated CI/CD (GitHub Actions), JWT + RBAC, custom throttling.
   - Metrics: 100+ concurrent users · 30% reduction in access-control overhead · 95% of environment-related errors eliminated · 100% deployment success after fixing Gunicorn/Supabase config issues.
   - Reliability: Sentry error tracking, Locust load testing, Twilio operational alerts.
   - Stack: Python, Django, DRF, PostgreSQL, Docker, GitHub Actions, JWT, Render, Supabase, Sentry, Locust, Twilio.
2. **Cloud-Native CI/CD Pipeline & Infrastructure Automation (GCP + Azure DevOps)**
   - Multi-repo cloud-native architecture; Azure DevOps pipelines for build/test/containerize/release; Terraform-provisioned GCP infra (VPC, GKE, artifact registry); Dev→Stage→Prod approval-gated rollouts; Helm-managed K8s deployments; private-subnet isolation.
   - Stack: GCP, Terraform, Kubernetes (GKE), Helm, Docker, Azure DevOps.

### 6.6 Engineering Timeline
- **2023** — Backend Foundations (Python, Django, DRF, PostgreSQL, JWT)
- **2023** — Cloud Fundamentals (AWS: EC2, S3, VPC, IAM, CloudWatch)
- **2024** — Infrastructure Automation (Docker, Kubernetes, Helm, Terraform, Jenkins, Ansible)
- **2024–2025** — Site Reliability & Multi-Cloud (GCP, Azure, Prometheus, Grafana, SRE practices)
- **2025–2026** — Platform Engineering & DevSecOps (Trivy, Snyk, OWASP ZAP, Sentry, CI/CD at scale)

### 6.7 Education
- **JNTU-GV College of Engineering, Vizianagaram** — B.Tech, Information Technology, Dec 2021 – May 2025, CGPA 8.32
- **Municipal Junior College, Nellore** — Intermediate (MPC), Jul 2018 – Mar 2020, CGPA 9.85
- **G.V.M.C High School, Visakhapatnam** — SSC, Jun 2017 – Mar 2018, CGPA 10.0

### 6.8 Certifications
`TODO: no certifications were present in the source resume.` Build the section as a conditional/collapsible block that **only renders if certification data exists** in the CMS/data file — do not fabricate certificates. Ship the site with this section hidden until real data is supplied.

### 6.9 Contact Section (site content, not chatbot)
- Headline reinforcing positioning: *"Interested in Platform Engineering, DevOps, Cloud Infrastructure, Backend Engineering or Site Reliability? Let's build reliable software together."*
- Shows: email (text, not a form), location (city/country only), LinkedIn/GitHub icons.
- Primary interaction in this section is the **chat launcher**, not a form (see rule §2.3).

---

## 7. DATA ARCHITECTURE

Keep all Section 6 content in typed data files, not hardcoded JSX, so content changes never require touching component logic:
```
/data
  profile.ts        // identity, hero copy, contact
  principles.ts
  skills.ts
  experience.ts
  projects.ts
  timeline.ts
  education.ts
  certifications.ts // empty array by default per §6.8
```
Each exports a typed const (e.g. `experience: ExperienceItem[]`) with interfaces defined in `/types`.

---

## 8. FOLDER STRUCTURE (Next.js App Router)

```
/app
  /layout.tsx            // fonts, theme provider, metadata
  /page.tsx               // composes all sections
  /api/chat/route.ts       // server route → Gemini
  /api/contact/route.ts    // server route → email send (invoked by chatbot flow only)
/components
  /nav
  /hero
  /principles
  /skills
  /experience
  /projects
  /timeline
  /education
  /contact
  /chatbot
    ChatWidget.tsx
    ChatLauncher.tsx
    ChatMessage.tsx
  /theme
    ThemeToggle.tsx
    ThemeProvider.tsx
  /ui                    // shared primitives (Card, Badge, Button, Section)
/data                    // per Section 7
/types
/lib
  gemini.ts               // server-only Gemini client wrapper
  email.ts                 // server-only email sender wrapper
  motion.ts                // shared Framer Motion variants
/public
  profile.jpg (placeholder)
  resume.pdf
Dockerfile               // multi-stage build, see 04-DOCKER_DEPLOYMENT.md
.dockerignore
docker-compose.yml        // app (+ optional reverse proxy) for local/prod runs
next.config.ts            // must set output: 'standalone'
.env.example               // documents required runtime env vars, no real values
```

> Deployment specifics (Dockerfile contents, compose setup, reverse proxy/TLS, CI image builds) are fully specified in **`04-DOCKER_DEPLOYMENT.md`** — treat it as part of this spec, not optional.

---

## 9. SEO & METADATA

- `metadata` export in `app/layout.tsx`: title, description (using the positioning statement), OpenGraph image (auto-generated via `next/og` or a static image), Twitter card, canonical URL.
- `robots.txt`, `sitemap.xml` generated via Next.js conventions.
- Structured data: `Person` schema (JSON-LD) with name, jobTitle, url, sameAs (LinkedIn/GitHub) — **no telephone property**.

---

## 10. ACCEPTANCE CHECKLIST (must all pass before "done")

- [ ] No phone/WhatsApp anywhere in source, rendered HTML, or metadata.
- [ ] No visible/functional mailto contact form; only chatbot-mediated messaging.
- [ ] Both themes implemented, toggle persists across reloads, all tokens from §3.1 used consistently.
- [ ] Hero name never breaks mid-word at any tested width.
- [ ] Nav collapses to overlay hamburger below 900px; works via mouse, touch, and keyboard.
- [ ] Every content section traces to Section 6 — nothing fabricated.
- [ ] Lighthouse ≥ 90 across all four categories, mobile + desktop.
- [ ] Chatbot only discusses Siddhartha's professional profile (verified against `03-CHATBOT_SYSTEM_PROMPT.md` test cases).
- [ ] Reduced-motion preference respected.
- [ ] Certifications section hidden (no fabricated data) unless real data supplied.
- [ ] `docker build` succeeds and produces a working container (`docker run`) with no secrets baked into the image (verify via `docker history`).
- [ ] App runs correctly behind the reverse proxy / TLS setup defined in `04-DOCKER_DEPLOYMENT.md`, with all runtime env vars supplied externally.
