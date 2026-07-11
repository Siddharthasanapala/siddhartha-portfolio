# DOCKER DEPLOYMENT SPEC
**Status:** Binding — supersedes any earlier mention of Vercel in `01-PORTFOLIO_BUILD_SPEC.md` and `02-IMPLEMENTATION_ROADMAP.md`. This is the deployment target for the project.

---

## 1. WHY / WHAT CHANGES

The site ships as a **Docker container**, not a Vercel deployment. This means:
- Next.js must build in **standalone output mode** (`output: 'standalone'` in `next.config.ts`) so the production image doesn't need the full `node_modules`/`next` toolchain at runtime.
- The two server-only API routes (`/api/chat`, `/api/contact`) run inside the same Node server process in the container — no serverless-function assumptions, no Vercel-specific APIs (e.g. no `@vercel/*` packages).
- All runtime secrets (`GEMINI_API_KEY`, email provider key, `CONTACT_EMAIL`) are supplied to the **running container**, never baked into the image at build time.
- You are responsible for the reverse proxy/TLS/host that previously Vercel handled for free — this doc specifies that too.

---

## 2. `next.config.ts` REQUIREMENT

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // if serving profile.jpg etc. from /public this is fine;
    // add remotePatterns here only if you later load images from an external host
  },
};

export default nextConfig;
```
`output: 'standalone'` makes `next build` emit a minimal `.next/standalone` folder containing only the files needed to run `node server.js` — this is what keeps the Docker image small and fast.

---

## 3. DOCKERFILE (multi-stage)

```dockerfile
# ---------- 1. Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN corepack enable && \
    if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    else npm ci; fi

# ---------- 2. Build ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time-only public config (NOT secrets) can go here as build ARGs if ever needed.
RUN corepack enable && \
    if [ -f pnpm-lock.yaml ]; then pnpm build; else npm run build; fi

# ---------- 3. Runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Run as non-root for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Basic container healthcheck — requires a lightweight /api/health route, see §5
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
```

**Notes for whoever builds this:**
- No `GEMINI_API_KEY` or any secret appears anywhere in this Dockerfile — that's intentional and must stay that way.
- Alpine base keeps the image small; if any native dependency needs glibc, switch to `node:20-slim` instead of `-alpine` for that stage only, and document why in a comment.
- The non-root `nextjs` user is required — do not run the container as root in production.

---

## 4. ENVIRONMENT VARIABLES (runtime-injected, never baked in)

Create `.env.example` in the repo (committed, no real values) documenting:
```
GEMINI_API_KEY=
CONTACT_EMAIL=siddharthasanapala136@gmail.com
RESEND_API_KEY=
# If using SMTP instead of Resend:
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASS=
NODE_ENV=production
```
Create a **real** `.env` (or `.env.production`) file **on the host only**, never committed (add to `.gitignore` and `.dockerignore`), and pass it to the container via `docker compose --env-file` or `docker run --env-file .env`. On a managed host (Fly.io, Railway, Render, Cloud Run, ECS, etc.), use that platform's secret manager instead of a plain file.

---

## 5. HEALTH CHECK ROUTE

Add `app/api/health/route.ts`:
```ts
export async function GET() {
  return Response.json({ status: "ok" }, { status: 200 });
}
```
Used by the Dockerfile `HEALTHCHECK`, and by any orchestrator/load balancer to know the container is alive. Keep it dependency-free (no Gemini/email calls) so it reflects server liveness, not third-party API health.

---

## 6. `docker-compose.yml` (local dev/test + simple production)

```yaml
services:
  portfolio:
    build:
      context: .
      dockerfile: Dockerfile
    image: siddhartha-portfolio:latest
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  # Reverse proxy + automatic TLS for production. Omit this service for local dev.
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - portfolio

volumes:
  caddy_data:
  caddy_config:
```

**`Caddyfile`** (automatic HTTPS via Let's Encrypt — simplest option for a solo DevOps-run box):
```
yourdomain.com {
    reverse_proxy portfolio:3000
}
```
Nginx is an equally valid alternative if you'd rather hand-manage certs (e.g. via certbot) — Caddy is recommended here purely because it removes a whole class of TLS-config work for a personal portfolio.

**.dockerignore**
```
node_modules
.next
.git
.env
.env.local
*.md
Dockerfile
docker-compose.yml
```

---

## 7. WHERE TO RUN THE CONTAINER

Any of these work; pick based on cost/control tradeoffs (you're the DevOps engineer here — this is your call, not a hard requirement):

| Option | Notes |
|---|---|
| Self-hosted VPS (e.g. a small droplet/VM) | Full control, matches your Terraform/Ansible skill set — provision with your own IaC, run via `docker compose up -d`. Good portfolio talking point in itself. |
| Fly.io / Railway / Render | Docker-native free/low-cost tiers, minimal ops overhead, good if you want it live fast. |
| Cloud Run (GCP) / ECS Fargate (AWS) / Azure Container Apps | Fits your existing GCP/AWS/Azure experience; pay-per-use, auto-scales, no host patching. |

Whichever you choose, the artifact is the same Docker image — only the "how it's hosted" differs. Consider documenting the chosen deployment (with a small architecture diagram) as a **third portfolio project** later — it's genuinely relevant DevOps content about your own site.

---

## 8. CI: BUILD & PUSH THE IMAGE (optional but recommended given your CI/CD background)

`.github/workflows/docker-publish.yml`:
```yaml
name: Build and Push Docker Image
on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```
This publishes to GitHub Container Registry on every push to `main`. Do not put `GEMINI_API_KEY` or any runtime secret in this workflow file or in build ARGs — it's build-only, secrets stay on the deploy host per §4.

---

## 9. LOCAL DEV VS. PRODUCTION

- **Local development:** keep using `pnpm dev` (fast refresh, no Docker needed) for day-to-day component work.
- **Pre-deploy verification:** before every deploy, run `docker compose up --build` locally and click through the site + chatbot against the containerized build — this is the actual artifact that ships, so it's the one that must be tested, not just `pnpm dev`.

---

## 10. ACCEPTANCE CRITERIA (Docker-specific)

- [ ] `next.config.ts` has `output: 'standalone'`.
- [ ] `docker build` succeeds with no warnings about missing standalone output.
- [ ] `docker history <image>` contains no API keys, tokens, or `.env` contents.
- [ ] Container runs as non-root (`nextjs` user).
- [ ] `/api/health` returns 200 and is wired into the Dockerfile `HEALTHCHECK`.
- [ ] `docker compose up` serves the full site (including working chatbot + contact email flow) with secrets supplied only via `.env`/host secret store.
- [ ] TLS/reverse proxy in front of the container in production (Caddy/Nginx or platform-managed).
- [ ] Image is reasonably small (Alpine-based `node:20-alpine` runtime stage, no dev dependencies present in the final image — verify with `docker run <image> ls node_modules` showing only production deps, if any at all under standalone mode).
