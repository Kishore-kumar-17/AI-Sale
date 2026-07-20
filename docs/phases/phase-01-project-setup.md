# Phase 1 — Project Setup

## Tasks

- Create project
- Configure Tailwind
- Configure Shadcn
- Configure Prisma
- Connect Neon Database
- Configure environment variables
- Configure Clerk Authentication

## Deliverables

- Running application
- Login page
- Dashboard layout
- Navigation
- Settings page

## Status

Scaffolding complete — build, lint, and type-check all pass; dev server serves `/`, `/sign-in`, `/sign-up`, `/dashboard`, `/settings`.

Blocked on credentials before it can be considered fully done:

- [ ] Add a real Neon `DATABASE_URL` to `.env`, then run `npx prisma migrate dev --name init`
- [ ] Add real Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) to `.env` so sign-in/sign-up actually work
- [ ] Manually verify login flow in a browser once keys are in place

What's built:
- Next.js (App Router, TypeScript, Turbopack) + Tailwind v4 + Shadcn UI (`base-nova` style)
- Prisma configured for PostgreSQL via `@prisma/adapter-pg`, with an initial `User` model (synced from Clerk)
- Clerk auth wired via `src/proxy.ts` (Next 16's replacement for `middleware.ts`), protecting all routes except `/sign-in` and `/sign-up`
- Dashboard layout with collapsible sidebar navigation (`src/components/app-sidebar.tsx`, `src/lib/nav-config.ts`), a placeholder Dashboard page with stat cards, and a Settings page (Clerk `UserProfile`)
- `.env.example` covering every credential the full spec will eventually need
