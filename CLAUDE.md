@AGENTS.md

# Nexivra Tech – AI Sales Assistant

## Project Overview

Production-ready AI Sales Assistant for Nexivra Tech's sales team: lead storage, automatic business research, personalized outreach generation, conversation tracking, meeting scheduling, proposal generation, follow-up management, analytics, and pipeline tracking.

Full spec lives in `docs/`. Read `docs/phases/` before starting any work — build proceeds one module at a time.

## Golden Rule

**Do not build everything at once. Build one module (phase) at a time. Wait until each module is complete before starting the next.** Never jump ahead to a later phase's files or schema even if it seems convenient.

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI
- Backend: Next.js API Routes, Node.js, Server Actions where appropriate
- Database: PostgreSQL (Neon) via Prisma
- Auth: Clerk
- Automation: n8n
- AI: OpenAI API (primary), Gemini API (optional)
- Storage: Cloudinary
- Hosting: Vercel
- Notifications: Gmail API, Google Calendar API

Full details: `docs/tech-stack.md`.

## Folder Structure

```
/src/app      Next.js app router pages/layouts
/components   Reusable UI components (Shadcn-based)
/lib          Shared client/server utilities (db client, clerk, cloudinary, etc.)
/hooks        React hooks
/prisma       Prisma schema + migrations
/services     Business logic (leads, research, outreach, proposals, meetings, follow-ups)
/types        Shared TypeScript types
/prompts      AI prompt templates (research, outreach, proposal, audit, chat)
/workflows    n8n workflow definitions/exports
/utils        Small generic helper functions
/public       Static assets
/docs         Project documentation
```

Keep business logic (`/services`, `/lib`) separate from UI (`/components`, `/src/app`). Details: `docs/folder-structure.md`.

## Coding Rules

- Always use TypeScript.
- Never hardcode secrets — use environment variables.
- Keep components reusable.
- Use Server Actions where appropriate.
- Write readable code; comment only where necessary (non-obvious why, not what).
- Follow clean architecture — business logic stays out of UI components.

Full list: `docs/coding-rules.md`.

## Database

Core tables: Users, Leads, Meetings, Notes, Messages, Research, Proposals, Tasks, Activities, Settings, AuditReports. Schema notes: `docs/database-schema.md`. Lead status flow: New → Contacted → Interested → Meeting Scheduled → Proposal Sent → Won/Lost.

## Security Requirements

Authentication, authorization, input validation, rate limiting, env-var secrets, SQL injection protection (via Prisma), XSS protection, CSRF protection. Details: `docs/security.md`.

## Automation Safety Rule

Follow-up automation (Phase 7) only ever **creates reminders**. It must never automatically send messages to leads unless a human has explicitly enabled that behavior.

## Documentation Requirement

Every module/phase, once built, must be documented with: Purpose, Architecture, Database Changes, API Routes, How It Works, Future Improvements. Template: `docs/documentation-standards.md`.

## Testing

Unit tests, API tests, UI tests, and integration tests are expected per module. Details: `docs/testing.md`.

## Build Phases

| # | Phase | Doc |
|---|---|---|
| 1 | Project Setup | `docs/phases/phase-01-project-setup.md` |
| 2 | CRM System | `docs/phases/phase-02-crm-system.md` |
| 3 | AI Business Research | `docs/phases/phase-03-ai-business-research.md` |
| 4 | Personalized Outreach Generator | `docs/phases/phase-04-outreach-generator.md` |
| 5 | Meeting Scheduler | `docs/phases/phase-05-meeting-scheduler.md` |
| 6 | Proposal Generator | `docs/phases/phase-06-proposal-generator.md` |
| 7 | Follow-up Automation | `docs/phases/phase-07-followup-automation.md` |
| 8 | Dashboard | `docs/phases/phase-08-dashboard.md` |
| 9 | n8n Integration | `docs/phases/phase-09-n8n-integration.md` |
| 10 | Website Audit | `docs/phases/phase-10-website-audit.md` |
| 11 | AI Sales Assistant (chat) | `docs/phases/phase-11-ai-sales-assistant.md` |

Current status: **Phase 1 (Project Setup) scaffolding complete**, blocked on the user supplying real Neon and Clerk credentials in `.env`. See `docs/phases/phase-01-project-setup.md` for the exact checklist before moving to Phase 2.
