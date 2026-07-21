import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { UserJSON } from "@clerk/backend";
import type { NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function primaryEmail(user: UserJSON): string | null {
  const email = user.email_addresses.find(
    (e) => e.id === user.primary_email_address_id
  );
  return email?.email_address ?? user.email_addresses[0]?.email_address ?? null;
}

function fullName(user: UserJSON): string | null {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || null;
}

export async function POST(request: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(request);
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const user = evt.data;
      const email = primaryEmail(user);
      if (!email) {
        console.error("Clerk user has no email address:", user.id);
        return new Response("User has no email address", { status: 400 });
      }
      await prisma.user.upsert({
        where: { clerkId: user.id },
        create: {
          clerkId: user.id,
          email,
          name: fullName(user),
          imageUrl: user.image_url,
        },
        update: {
          email,
          name: fullName(user),
          imageUrl: user.image_url,
        },
      });
      break;
    }
    case "user.deleted": {
      if (evt.data.id) {
        try {
          await prisma.user.delete({ where: { clerkId: evt.data.id } });
        } catch (err) {
          // P2025: no matching User row — already gone, nothing to do.
          const alreadyGone =
            err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025";
          if (!alreadyGone) {
            // Most commonly P2003: the user still has leads and Lead.createdById
            // is ON DELETE RESTRICT, so the row is intentionally kept — but log it,
            // since silently doing nothing here would look like a successful sync.
            console.error("Failed to delete User for Clerk user.deleted:", evt.data.id, err);
          }
        }
      }
      break;
    }
    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
