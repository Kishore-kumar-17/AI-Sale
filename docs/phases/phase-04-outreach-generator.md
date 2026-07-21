# Phase 4 — Personalized Outreach Generator

Generate WhatsApp messages (plus other channel versions below).

## Message Requirements

- Human tone
- No emojis
- No AI phrases
- Mention one observation
- Mention business name
- Mention one benefit
- Maximum 150 words
- End with soft call-to-action

## Generate

- First message
- Second follow-up
- Third follow-up
- Email version
- LinkedIn version
- Instagram DM version

Each version must be different (not a copy-paste across channels).

## Status

Complete — verified end-to-end with a live AI call.

- `Message` model + `MessageChannel`/`MessageSequenceStep` enums added to `prisma/schema.prisma` (one row per lead/channel/step, unique on that triple; regenerating overwrites all 6), migration `20260721090539_add_messages`
- `src/types/message.ts` — Zod schema for the AI's structured output (6 keys) and `MESSAGE_SLOTS` mapping each key to its channel/step/label
- `src/prompts/outreach.ts` — prompt builder combining the lead's details and (if present) its Phase 3 research notes; instructs human tone, no emojis, no AI clichés, one observation, business name, one benefit tied to Nexivra Tech's website/SEO services, 150-word max, soft CTA, and 6 genuinely distinct versions
- `src/lib/ai.ts` — extracted the provider-agnostic AI client logic (NVIDIA NIM / OpenAI, JSON-object prompting) out of `services/research.ts` so both Phase 3 and Phase 4 share it
- `src/services/outreach.ts` — generates all 6 messages in a single AI call (keeping latency to one round trip instead of six) and upserts them in a transaction; 30s regenerate cooldown as basic rate limiting
- `src/app/(dashboard)/leads/[id]/` — `generate-outreach-button.tsx`, `outreach-view.tsx` (renders all 6 messages with a copy-to-clipboard button each), wired into the lead detail page below the research section
- Verified via `tsc`/`eslint`/`next build` (all clean) and a live Playwright run: created a lead, clicked "Generate Outreach Messages", and confirmed all 6 versions (WhatsApp first + 2 follow-ups, Email with subject line, LinkedIn, Instagram DM) rendered — each genuinely different in wording/angle, human-toned, no emojis, correctly mentioning the business name, an observation, and a Nexivra Tech benefit

## Future Improvements

- Generation took ~100s–150s for all 6 messages on the free NVIDIA NIM tier in testing — same Vercel serverless-timeout concern already noted in Phase 3 applies here, more acutely (larger output). Revisit before deployment.
- No enforcement of the 150-word cap or "no emojis"/"no AI phrases" rules beyond the prompt itself — currently trusting the model's compliance rather than validating/re-generating on violation.
