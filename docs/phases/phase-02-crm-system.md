# Phase 2 — CRM System

Build Lead Management.

## Lead Fields

- Business Name
- Owner Name
- Category
- Phone
- Email
- Instagram
- Website
- Address
- City
- State
- Country
- Followers
- Business Status
- Lead Source
- Notes
- Created Date
- Updated Date
- Status

## Statuses

- New
- Contacted
- Interested
- Meeting Scheduled
- Proposal Sent
- Won
- Lost

## Features

- Create Lead
- Edit Lead
- Delete Lead
- Search
- Filter
- Pagination
- CSV Export
- Validation

## Status

Complete — verified end-to-end via automated browser testing.

- `Lead` model + `LeadStatus` enum added to `prisma/schema.prisma`, migration `20260720164202_add_leads` applied
- `src/services/leads.ts` — business logic: create/update/delete, search + status/category filtering, pagination, CSV export query, dashboard stats
- `src/types/lead.ts` — shared Zod validation schema + types (`docs/security.md` input-validation requirement)
- `src/app/(dashboard)/leads/` — list page (search, status/category filters, pagination, delete confirm dialog), create page, edit page, server actions
- `src/app/api/leads/export/route.ts` — CSV export respecting current filters
- Dashboard's Total Leads / Today's Leads / Conversion Rate stat cards now show real data (Meetings stays a placeholder until Phase 5)
- Verified directly against the real Neon database (insert/search/delete), via `tsc`/`eslint`/`next build`, and via a full Playwright browser run covering sign-up through lead deletion (see checklist below)

## Manual verification checklist

All items below were exercised end-to-end with a real headed Chromium browser via Playwright (sign-up with Clerk's dev-mode test verification code, synced to Postgres, then driven through the UI):

- [x] Create a lead via `/leads/new`, confirm redirect to its detail page
- [x] Edit the lead, confirm changes persist
- [x] Search and status/category filters narrow the list correctly
- [x] Pagination works with more than one page of leads (tested with 25+ leads)
- [x] CSV export downloads a file matching the current filters
- [x] Delete a lead via the confirm dialog, confirm it's removed from the list

Test scripts and screenshots were scratch/temporary and have been deleted after the run; the test user, its leads, and its Clerk account were cleaned up automatically at the end of the script.
