# Phase 3 — AI Business Research

## Input

- Business Name
- Instagram Link
- Website

## AI Should Generate

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

Output must be stored in the database (`Research` table — see `docs/database-schema.md`).

## Status

Built — blocked on a real `OPENAI_API_KEY` for live verification.

- `Research` model added to `prisma/schema.prisma` (one row per lead; regenerating overwrites it), migration `20260721073512_add_research`
- `src/types/research.ts` — Zod schema for the AI's structured output
- `src/prompts/research.ts` — prompt builder using the lead's business name, category, Instagram, website, and location
- `src/services/research.ts` — calls OpenAI (`gpt-4o-mini`) via Structured Outputs (`zodResponseFormat`) so the response is guaranteed to match the schema, then upserts into `Research`; includes a 30s regenerate cooldown as basic rate limiting on the AI-generation endpoint (per `docs/security.md`)
- `src/app/(dashboard)/leads/[id]/` — `generate-research-button.tsx` (Server Action + `useActionState`), `research-view.tsx` (renders all 13 fields, including a color-swatch view for the recommended palette), wired into the lead detail page
- Verified via `tsc`/`eslint`/`next build` (all clean) and a full Playwright browser run: signed up, created a lead with real-looking business details, clicked "Generate Research", and confirmed the action reaches the OpenAI call and fails gracefully (clean error message, no crash) when `OPENAI_API_KEY` is unset

## What's not yet real-world verified

`OPENAI_API_KEY` in `.env` is currently blank, so an actual AI-generated research brief has not been produced yet. Once a real key is added, the same "Generate Research" button should produce and display a real result — worth a quick manual check.

## Future Improvements

- The model has no live web access — it infers from the business name/category/handles/location rather than actually reading the given Instagram/website content. A future upgrade could use OpenAI's web-search-enabled tools (or a scraping step) to ground the research in the real page content, at the cost of extra latency/complexity and API cost.
