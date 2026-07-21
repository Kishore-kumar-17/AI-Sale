# Phase 5 — Meeting Scheduler

Trigger: user updates lead status to **Interested**.

## Allow

- Meeting Date
- Meeting Time
- Meeting Type: Online / Offline

## Automatically

- Create Google Calendar Event
- Store Meeting Notes
- Update CRM
- Send Reminder

## Status

Built — verified end-to-end without a Google connection; blocked on real Google OAuth credentials for the Calendar-sync path.

- `Meeting` model + `MeetingType`/`ReminderStatus` enums added to `prisma/schema.prisma`; `User` gained `googleRefreshToken`/`googleAccessToken`/`googleTokenExpiry`/`googleConnectedEmail` (per-user Google Calendar connection, not a separate Settings table — simplest fit since it's a 1:1 property of the signed-in user), migration `20260721093556_add_meetings_and_google_calendar`
- `src/lib/google-calendar.ts` — OAuth URL generation, code-for-tokens exchange, disconnect, and calendar-event creation (30-minute events, Google Meet link auto-created for Online meetings, email+popup reminders configured on the event itself, the lead invited as an attendee by email if one is on file)
- `src/app/api/google/connect` + `.../callback` — OAuth redirect flow with CSRF protection via a short-lived signed state cookie; `/connect` fails gracefully with a friendly redirect if `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` aren't configured yet
- `src/app/(dashboard)/settings/` — Google Calendar connection card (connect/disconnect, shows the connected account's email)
- `src/services/meetings.ts` — `createMeeting`: always records the meeting and updates the lead's status to Meeting Scheduled regardless of whether Google Calendar sync succeeds (calendar sync is a bonus, never a blocker); Google Calendar failures are caught and logged, not surfaced as a hard error
- `src/app/(dashboard)/leads/[id]/` — `meeting-form.tsx` (date + time + type + notes) and `meetings-view.tsx`, wired into the lead detail page; the scheduling form is hidden until the lead's status is Interested or later (the Phase 5 trigger), and stays visible afterward if any meetings already exist
- Verified via `tsc`/`eslint`/`next build` (all clean) and a live Playwright run: created a lead, confirmed the meeting form is hidden while status is New, changed status to Interested, confirmed the form appears, scheduled a meeting (no Google connected), confirmed it renders with a "not synced" badge, and confirmed the lead's status auto-updated to Meeting Scheduled; also confirmed the Settings page renders the Connect Google Calendar option correctly

## What's not yet real-world verified

`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`GOOGLE_REDIRECT_URI` in `.env` are blank, so the actual OAuth connect flow and real Google Calendar event creation (with the Meet link, reminders, and attendee invite) haven't been exercised against the real Google API yet. Needs a Google Cloud OAuth 2.0 Client ID (Web application, Calendar API enabled) — see the comment above those variables in `.env.example`.

## Bug found and fixed during this phase

A cross-browser/Playwright quirk with controlled `<input type="date">`: mirroring the date input into React state via `onChange` and combining it with the time input on every render caused the date value to silently reset to empty once the time input's `onChange` triggered a re-render (the date input's controlled value snapped back to its stale, empty state). Fixed by switching `meeting-form.tsx` to read the raw date/time DOM values via refs at submit time (an `onSubmit` handler that fills a hidden ISO-datetime field right before the Server Action runs) instead of mirroring them into React state — this also keeps the datetime combination in the user's actual local timezone rather than the server's.

## Future Improvements

- Meeting duration is hardcoded to 30 minutes; make it configurable.
- No cancel/reschedule flow yet — scheduling again for the same lead just adds another meeting row rather than updating/cancelling the Google Calendar event tied to a previous one.
- Reminders currently rely entirely on Google Calendar's own notification system (email 24h before, popup 30m before to the connected account, plus an invite email to the lead if they have one on file) rather than a custom in-app reminder job — Phase 7 (Follow-up Automation) is the more natural place for CRM-native reminders.
