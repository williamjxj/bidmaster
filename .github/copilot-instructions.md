# 🧑‍💻 Copilot Instructions for BidMaster

This guide helps AI coding agents work productively in the BidMaster codebase. It summarizes architecture, workflows, and conventions unique to this project.

## 🏗️ Architecture Overview
- **Framework:** Next.js 15+ (App Router, TypeScript)
- **Database:** Supabase (PostgreSQL, RLS)
- **Auth:** Supabase Auth, middleware-protected routes
- **Styling:** TailwindCSS 4, shadcn/ui, Radix UI
- **State:** TanStack React Query
- **Key Directories:**
  - `src/app/` — Next.js app router, pages, API routes
  - `src/components/` — UI and dashboard components
  - `src/hooks/` — Custom React hooks
  - `src/lib/` — Core logic: API, scrapers, error handling
  - `src/types/` — TypeScript types
  - `database/` — SQL schema and migrations
  - `public/` — Static assets

## 🛠️ Developer Workflows
- **Start Dev Server:** `npm run dev` (port 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Type Check:** `npm run type-check`
- **Test Crawlers:**
  - Basic: `npm run test:crawlers`
  - Advanced: `npm run test:crawlers:advanced`
  - Full: `npm run test:crawlers:full`
- **Scraping Validation:** `npm run scrape:validate`
- **Benchmarking:** `npm run benchmark:crawlers`
- **Database Reset:** `npm run db:reset` (uses `database/schema.sql`)
- **Demo Account:** `npm run create-demo`

## 📦 Project-Specific Patterns
- **API routes:** Use `src/app/api/*` for server endpoints. Scraping logic in `src/app/api/scrape/`.
- **Error Handling:** Centralized in `src/lib/error-handler.ts` and `src/lib/crawler-error-handler.ts`.
- **State Management:** Use React Query for server state, avoid Redux.
- **UI:** Compose with shadcn/ui and Radix primitives. Prefer `src/components/ui/` for reusable elements.
- **Type Safety:** All code is TypeScript, strict mode enforced.
- **Auth:** Protect routes via Supabase Auth and Next.js middleware (`middleware.ts`).
- **Testing:** Crawler tests in `scripts/` and via npm scripts above.

## 🔗 Integration Points
- **Supabase:** Used for DB and Auth. Credentials in `.env.local`.
- **External APIs:** Scraping endpoints integrate with freelance platforms (see `src/lib/enhanced-scraper.ts`).
- **Analytics:** Dashboard metrics in `src/components/dashboard-metrics.tsx`.

## 📝 Example Patterns
- **Adding a new API route:**
  1. Create file in `src/app/api/[route]/`
  2. Export handler as default
  3. Use TypeScript types from `src/types/`
- **Adding a UI component:**
  1. Place in `src/components/`
  2. Use shadcn/ui and TailwindCSS
  3. Export as default

## ⚠️ Conventions & Gotchas
- **No Redux, MobX, or Context API for global state. Use React Query.**
- **All DB changes via SQL in `database/`.**
- **Do not hardcode secrets. Use `.env.local`.**
- **All code must pass lint and type checks before PRs.**

---

For more details, see `README.md`, `CLAUDE.md`, and docs in `docs/`.
