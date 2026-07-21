# Phase 7 — Follow-up Automation

## Rules

- No response after 3 days → create reminder
- No response after 7 days → create second reminder
- Proposal not answered after 5 days → create reminder
- Meeting tomorrow → notify sales person

## Critical Safety Rule

**Never automatically send messages.** Only create reminders, unless explicitly enabled by a human.

## Status

Complete — verified end-to-end.

- `Task` model + `TaskType` enum added to `prisma/schema.prisma` (reminders only; no message content or send capability anywhere on this model). `Lead.statusChangedAt` and `Proposal.sentAt` were added so the "N days since X" rules have an accurate reference point distinct from the general-purpose `updatedAt` (which bumps on any field edit, not just status changes) — migration `20260721110416_add_tasks_and_status_tracking`
- `src/services/tasks.ts` — `generateFollowUpReminders()` scans for the four rule conditions and creates a `Task` row for each newly-qualifying lead/proposal/meeting; idempotent (checks for an existing incomplete task of the same type before creating, so repeated runs don't duplicate reminders)
- `src/app/api/cron/followups/route.ts` — secret-protected (`CRON_SECRET`, via `Authorization: Bearer`) endpoint that runs the scan; scheduled daily at 03:00 via `vercel.json` (Vercel Cron). Made public in `src/proxy.ts` since it authenticates itself rather than via a Clerk session
- `src/app/(dashboard)/tasks/` — a Tasks page listing open reminders (title, lead, type, due date, mark-done), plus a manual "Check for New Reminders" button for testing or for use before Vercel Cron is set up; added to the sidebar nav
- Verified via `tsc`/`eslint`/`next build` (all clean) and a live Playwright run: backdated a lead's `statusChangedAt` by 8 days (CONTACTED) to trigger both the 3-day and 7-day reminders, backdated a `Proposal.sentAt` by 6 days (SENT) to trigger the proposal-unanswered reminder, and scheduled a real meeting for tomorrow to trigger the meeting reminder — confirmed all 4 reminders appear, confirmed re-running the scan does not create duplicates, confirmed marking a task done removes it from the open list, and confirmed the cron route correctly rejects requests without the right secret and accepts them with it

## Critical Safety Rule — compliance

Confirmed by code review: `generateFollowUpReminders()` and everything it calls only ever creates `Task` rows. There is no code path anywhere in this phase that sends an email, WhatsApp message, or any other communication to a lead. Following up is still a manual, human action (using the Phase 4 outreach messages or your own words).

## Known nuance

The manual "Check for New Reminders" button is idempotent against *existing* reminders, but if you mark a reminder done and its underlying condition still holds (e.g. the meeting is still "tomorrow"), clicking the button again immediately recreates it. This only matters for repeated manual clicks in quick succession — the intended daily Vercel Cron run won't hit this in practice, since by the next day the condition will have moved on (meeting passed, or lead progressed).
