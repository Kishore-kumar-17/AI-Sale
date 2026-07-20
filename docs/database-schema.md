# Database Schema (Overview)

Full field-level Prisma schema is authored during Phase 1/2 implementation. This doc captures the required tables and known fields from the spec.

## Tables

- Users
- Leads
- Meetings
- Notes
- Messages
- Research
- Proposals
- Tasks
- Activities
- Settings
- AuditReports

## Leads

### Fields

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

### Status values

- New
- Contacted
- Interested
- Meeting Scheduled
- Proposal Sent
- Won
- Lost

## Research

Stores AI-generated business research output (Phase 3), linked to a Lead:

- Business Summary
- Products
- Services
- Target Audience
- Strengths
- Weaknesses
- Website Suggestions
- Recommended Pages
- Possible Pain Points
- Suggested CTA
- Recommended Color Palette
- SEO Opportunities
- Google Ranking Opportunities

## Messages

Generated outreach content (Phase 4), per Lead per channel/sequence step:

- Channel (WhatsApp, Email, LinkedIn, Instagram DM)
- Sequence step (First message, Follow-up 2, Follow-up 3)
- Content
- Generated date

## Meetings

- Meeting Date
- Meeting Time
- Meeting Type (Online / Offline)
- Google Calendar Event ID
- Meeting Notes
- Reminder status

## Proposals

- Sections (Introduction, Understanding Client, Problem Statement, Solution, Features, Timeline, Pricing, Deliverables, Support, Terms)
- Export format record (PDF/DOCX)
- Status (sent/answered/unanswered)

## Tasks / Activities

Follow-up reminders (Phase 7) and general activity/audit log entries for the dashboard (Phase 8).

## AuditReports

Website audit results (Phase 10): Homepage Score, SEO Score, Performance Score, Trust Score, UX Score, Security Score, missing-elements flags, recommendations.
