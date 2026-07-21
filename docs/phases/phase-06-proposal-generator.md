# Phase 6 — Proposal Generator

Generate proposals using AI.

## Sections

- Introduction
- Understanding Client
- Problem Statement
- Solution
- Features
- Timeline
- Pricing
- Deliverables
- Support
- Terms

## Export

- PDF
- DOCX

## Status

Complete — verified end-to-end with a live AI call, including both export formats.

- `Proposal` model + `ProposalStatus`/`ProposalExportFormat` enums added to `prisma/schema.prisma` (one proposal per lead; regenerating overwrites it and resets status/export tracking back to Unanswered, since previously-sent content is no longer what's live), migration `20260721101136_add_proposals`
- `src/types/proposal.ts` — Zod schema for the AI's structured output (10 keys)
- `src/prompts/proposal.ts` — prompt builder using the lead's details plus Phase 3 research when available, tailored to Nexivra Tech's website design/SEO services; produces all 10 sections in one AI call
- `src/services/proposals.ts` — `generateProposalForLead` (30s regenerate cooldown), `updateProposalStatus` (marking a proposal Sent automatically updates the lead's status to Proposal Sent, matching the pipeline flow), `recordProposalExport`
- `src/lib/proposal-pdf.tsx` (via `@react-pdf/renderer`) and `src/lib/proposal-docx.ts` (via `docx`) — render the same proposal content to PDF and DOCX
- `src/app/api/leads/[id]/proposal/export?format=pdf|docx` — streams the generated file and records the export
- `src/app/(dashboard)/leads/[id]/` — `generate-proposal-button.tsx`, `proposal-view.tsx` (all 10 sections, status badge, Export PDF/DOCX buttons, Mark as Sent / Mark as Answered), wired into the lead detail page below Meetings
- Verified via `tsc`/`eslint`/`next build` (all clean) and a live Playwright run: generated a real proposal (took ~2.5–4 min on the free NVIDIA tier — the biggest generation payload of any AI feature so far), confirmed all 10 sections render with realistic content (₹ pricing, a sensible week-by-week timeline, concrete features/deliverables/terms), downloaded and validated both the PDF (`%PDF` header) and DOCX (zip/`PK` header) exports, and confirmed marking a proposal Sent updates the lead's status to Proposal Sent

## Future Improvements

- Generation latency (~2.5–4 minutes on the free tier) is now a firm blocker for any synchronous-request deployment model — this is the strongest signal yet (following Phase 3 and 4's smaller versions of the same issue) that AI generation needs to move off the request/response cycle before deploying (background job + polling or webhook, per the note already logged in Phase 3/4).
- No proposal history/versioning — regenerating overwrites the single proposal per lead rather than keeping prior versions.
- Pricing is a single free-text block rather than a structured line-item table; fine for now, but a real pricing table (with per-line amounts summed automatically) would be more robust than trusting the model's arithmetic in prose.
