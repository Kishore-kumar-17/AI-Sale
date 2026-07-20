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

Built — pending manual browser verification.

- `Lead` model + `LeadStatus` enum added to `prisma/schema.prisma`, migration `20260720164202_add_leads` applied
- `src/services/leads.ts` — business logic: create/update/delete, search + status/category filtering, pagination, CSV export query, dashboard stats
- `src/types/lead.ts` — shared Zod validation schema + types (`docs/security.md` input-validation requirement)
- `src/app/(dashboard)/leads/` — list page (search, status/category filters, pagination, delete confirm dialog), create page, edit page, server actions
- `src/app/api/leads/export/route.ts` — CSV export respecting current filters
- Dashboard's Total Leads / Today's Leads / Conversion Rate stat cards now show real data (Meetings stays a placeholder until Phase 5)
- Verified directly against the real Neon database (insert/search/delete) and via `tsc`/`eslint`/`next build`; the browser click-through (create → edit → delete → search/filter → CSV export) still needs to be done manually, since it's outside what can be checked from the terminal

## Manual verification checklist

- [ ] Create a lead via `/leads/new`, confirm redirect to its detail page
- [ ] Edit the lead, confirm changes persist
- [ ] Search and status/category filters narrow the list correctly
- [ ] Pagination works with more than one page of leads
- [ ] CSV export downloads a file matching the current filters
- [ ] Delete a lead via the confirm dialog, confirm it's removed from the list
