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

**Complete.** Build, lint, and type-check all pass; dev server serves `/`, `/sign-in`, `/sign-up`, `/dashboard`, `/settings`. Full auth flow verified end-to-end in a browser: sign-up creates a Clerk account, redirects to `/dashboard`, and the Clerk webhook syncs a real `User` row into Neon Postgres.

- [x] Add a real Neon `DATABASE_URL` to `.env`, then run `npx prisma migrate dev --name init`
- [x] Add real Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) to `.env` so sign-in/sign-up actually work
- [x] Manually verify login flow in a browser once keys are in place

What's built:
- Next.js (App Router, TypeScript, Turbopack) + Tailwind v4 + Shadcn UI (`base-nova` style)
- Prisma configured for PostgreSQL via `@prisma/adapter-pg`, with an initial `User` model (synced from Clerk)
- Clerk auth wired via `src/proxy.ts` (Next 16's replacement for `middleware.ts`), protecting all routes except `/sign-in`, `/sign-up`, and `/api/webhooks/*`
- `src/app/api/webhooks/clerk/route.ts` — verifies Clerk webhook signatures and upserts/deletes the corresponding `User` row on `user.created`/`user.updated`/`user.deleted`
- Dashboard layout with collapsible sidebar navigation (`src/components/app-sidebar.tsx`, `src/lib/nav-config.ts`), a placeholder Dashboard page with stat cards, and a Settings page (Clerk `UserProfile`)
- `.env.example` covering every credential the full spec will eventually need (including `CLERK_WEBHOOK_SIGNING_SECRET`)
