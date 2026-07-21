import type { NextRequest } from "next/server";
import { generateFollowUpReminders } from "@/services/tasks";

// Triggered by Vercel Cron (see vercel.json) — authenticated via CRON_SECRET rather than
// a Clerk session, since there's no signed-in user for a scheduled job. Also callable
// manually (e.g. `curl -H "Authorization: Bearer $CRON_SECRET" .../api/cron/followups`)
// for local testing before Vercel Cron is set up.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await generateFollowUpReminders();
  return Response.json(result);
}
