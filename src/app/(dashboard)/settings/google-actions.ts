"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { disconnectGoogle } from "@/lib/google-calendar";

export async function disconnectGoogleAction() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return;

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return;

  await disconnectGoogle(user.id);
  revalidatePath("/settings");
}
