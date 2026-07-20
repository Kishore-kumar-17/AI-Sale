import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { UserJSON } from "@clerk/backend";
import type { NextRequest } from "next/server";
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
        await prisma.user
          .delete({ where: { clerkId: evt.data.id } })
          .catch(() => {});
      }
      break;
    }
    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
