# Documentation Standards

Every module must include documentation covering:

1. **Purpose** — what the module does and why it exists
2. **Architecture** — how it fits into the app (components, services, API routes involved)
3. **Database Changes** — new/changed Prisma models or fields
4. **API Routes** — endpoints added, request/response shape
5. **How It Works** — the actual flow, step by step
6. **Future Improvements** — known gaps or deferred ideas

Place each module's documentation alongside the phase doc in `docs/phases/`, appended once that phase is implemented, or as a new `docs/modules/<name>.md` file referenced from the phase doc.
