# Nexivra Tech – AI Sales Assistant

A production-ready AI Sales Assistant that helps the Nexivra Tech sales team find leads, research businesses, generate personalized outreach, schedule meetings, manage follow-ups, generate proposals, and track the full sales pipeline.

## Status

Phase 1 (Project Setup) in progress. Build proceeds **one module (phase) at a time** — see `docs/phases/`. Do not start a new phase until the current one is complete and reviewed.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app. Edit `src/app/page.tsx` — it hot-reloads.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | Clerk |
| Automation | n8n |
| AI | OpenAI API, Gemini API (optional) |
| Storage | Cloudinary |
| Hosting | Vercel |
| Notifications | Gmail API, Google Calendar API |
| VCS | GitHub |

See `docs/tech-stack.md` for details.

## Documentation Map

- `CLAUDE.md` — instructions for Claude Code when working in this repo
- `docs/tech-stack.md` — full technology stack
- `docs/folder-structure.md` — target project layout
- `docs/database-schema.md` — data model overview
- `docs/ui-requirements.md` — UI/UX requirements
- `docs/security.md` — security requirements
- `docs/testing.md` — testing requirements
- `docs/documentation-standards.md` — per-module documentation requirements
- `docs/coding-rules.md` — coding conventions
- `docs/deliverables.md` — final deliverables checklist
- `docs/phases/phase-01-project-setup.md` through `phase-11-ai-sales-assistant.md` — build order, one module per file

## Build Order

1. Project Setup
2. CRM System
3. AI Business Research
4. Personalized Outreach Generator
5. Meeting Scheduler
6. Proposal Generator
7. Follow-up Automation
8. Dashboard
9. n8n Integration
10. Website Audit
11. AI Sales Assistant (chat interface)

Each phase must be fully working before the next begins.
