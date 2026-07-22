# Phase 8 — Dashboard

## Statistics

- Total Leads
- Today's Leads
- Meetings
- Revenue
- Conversion Rate
- Top Industries
- Top Performing Sales Person
- Lead Funnel

## Charts

- Bar
- Line
- Pie

## Panels

- Recent Activity
- Upcoming Meetings
- Pending Follow-ups

## Status

Complete — verified end-to-end with live data.

- `Lead.dealValue` (₹, manually entered — typically once a lead is Won) added so Revenue is a real number rather than a placeholder; exposed as a field in the lead form
- `Activity` model + `ActivityType` enum added (append-only audit log). Instrumented every existing AI/CRM action to log one: lead created, lead status changed, research generated, outreach generated, meeting scheduled, proposal generated, proposal status changed, task completed
- `src/services/dashboard.ts` — aggregation queries: `getDashboardStats` (total/today's leads, meetings + upcoming count, revenue, conversion rate), `getTopIndustries` (grouped by category), `getTopPerformer` (by Won-lead revenue per user), `getLeadFunnel` (count per pipeline status), `getLeadsTrend` (leads created per day, last 14 days), `getUpcomingMeetings`
- Charts via `recharts`: Bar (Lead Funnel), Pie (Top Industries), Line (Leads Trend) — using the theme's existing `--chart-1`..`--chart-5` CSS variables rather than introducing new colors
- Panels: Recent Activity (from the new `Activity` log), Upcoming Meetings, Pending Follow-ups (reusing Phase 7's task list)
- Verified via `tsc`/`eslint`/`next build` (all clean) and a live Playwright run: created leads with categories and a Won deal value, confirmed all 6 stat cards show correct numbers, all 3 charts render, Top Industries groups correctly, Recent Activity shows real logged events, and the panels render

## Bug found and fixed during this phase

`getLeadsTrend`'s day-bucketing mixed local-timezone date mutation (`setHours`/`setDate`) with UTC-based key extraction (`toISOString().slice(0,10)`) — for any server timezone with a non-zero UTC offset, this silently shifted every bucket by a day, so leads created "today" landed in the wrong bucket and the trend line rendered completely flat despite real data existing. Live-tested against a real dashboard render, not just caught by types (a timezone bug like this is invisible to `tsc`/`eslint`/build, which don't execute the actual date arithmetic against real data). Fixed by bucketing entirely in UTC-day terms (`Date.UTC` arithmetic throughout) and forcing `timeZone: "UTC"` when re-parsing the date-only string for the chart's axis labels, so the bucket boundary and its displayed label always agree.

## Future Improvements

- "Top Performer" ranks by total Won-lead revenue; a toggle for ranking by Won-lead count instead would be useful for teams that value volume over deal size.
- No date-range picker — Leads Trend is fixed to the last 14 days.
