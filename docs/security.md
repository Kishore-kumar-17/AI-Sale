# Security Requirements

- Authentication (Clerk)
- Authorization (role/ownership checks on every lead/meeting/proposal mutation)
- Input Validation (validate all API route and Server Action inputs, e.g. with Zod)
- Rate Limiting (especially on AI-generation endpoints)
- Environment Variables (never hardcode secrets — API keys, DB URLs, Clerk/Cloudinary/Gmail/Calendar credentials all via env vars)
- SQL Injection Protection (use Prisma parameterized queries — no raw string-built SQL)
- XSS Protection (sanitize/escape any user- or AI-generated content rendered as HTML)
- CSRF Protection (rely on Next.js/Clerk defaults; verify for any non-standard form posting)
