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

Complete — verified end-to-end with a live AI call.

- `Research` model added to `prisma/schema.prisma` (one row per lead; regenerating overwrites it), migration `20260721073512_add_research`
- `src/types/research.ts` — Zod schema for the AI's structured output
- `src/prompts/research.ts` — prompt builder using the lead's business name, category, Instagram, website, and location; instructs the model to return raw JSON matching the schema exactly (no provider-specific structured-output feature, so it works across OpenAI-SDK-compatible providers)
- `src/services/research.ts` — provider-agnostic OpenAI-SDK client: uses `NVIDIA_API_KEY` (NVIDIA NIM, OpenAI-SDK compatible, free tier — the provider currently configured) if set, otherwise falls back to `OPENAI_API_KEY`; parses the model's JSON response (defensively stripping markdown code fences) and validates it against the Zod schema before upserting into `Research`; includes a 30s regenerate cooldown as basic rate limiting on the AI-generation endpoint (per `docs/security.md`)
- `src/app/(dashboard)/leads/[id]/` — `generate-research-button.tsx` (Server Action + `useActionState`), `research-view.tsx` (renders all 13 fields, including a color-swatch view for the recommended palette), wired into the lead detail page
- Verified via `tsc`/`eslint`/`next build` (all clean) and two Playwright browser runs: (1) confirmed the action fails gracefully with no configured key, (2) with a real NVIDIA NIM key (`meta/llama-3.3-70b-instruct`), signed up, created a lead ("Chennai Cloud Kitchen Co"), clicked "Generate Research", and confirmed a full real research brief rendered correctly (summary, products/services, target audience, strengths/weaknesses, website suggestions, recommended pages, pain points, CTA, color palette, SEO/ranking opportunities)

## Future Improvements

- The model has no live web access — it infers from the business name/category/handles/location rather than actually reading the given Instagram/website content. A future upgrade could use web-search-enabled tools (or a scraping step) to ground the research in the real page content, at the cost of extra latency/complexity and API cost.
- The free NVIDIA NIM 70B model took 47–92s per generation in testing. That's fine for local dev, but on Vercel this risks exceeding serverless function time limits (Hobby caps around 60s) once the app is deployed. Worth revisiting before Phase 8/9 deployment — options include a faster/smaller model, `maxDuration` route config, or moving generation to a background job.
