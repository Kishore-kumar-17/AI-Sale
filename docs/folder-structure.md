# Folder Structure

Clean architecture — business logic separate from UI.

```
/app          Next.js app router pages/layouts
/components   Reusable UI components (Shadcn-based)
/lib          Shared client/server utilities (db client, clerk, cloudinary, etc.)
/hooks        React hooks
/prisma       Prisma schema + migrations
/api          API route handlers (if not colocated under /app/api)
/services     Business logic (leads, research, outreach, proposals, meetings, follow-ups)
/types        Shared TypeScript types
/prompts      AI prompt templates (research, outreach, proposal, audit, chat)
/workflows    n8n workflow definitions/exports
/utils        Small generic helper functions
/public       Static assets
/docs         Project documentation (this folder)
```

## Principles

- UI components (`/app`, `/components`) render and dispatch — they do not contain business logic.
- Business logic lives in `/services`, called from Server Actions or API routes.
- AI prompt construction lives in `/prompts`, not inline in components or services.
- Types shared across frontend/backend live in `/types`.
