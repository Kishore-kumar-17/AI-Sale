"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import * as meetingsService from "@/services/meetings";
import { meetingInputSchema, type MeetingInput } from "@/types/meeting";

async function requireCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    throw new Error("Signed-in user has no matching User record yet");
  }

  return user;
}

export type MeetingFormState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof MeetingInput, string>>;
};

export async function scheduleMeetingAction(
  leadId: string,
  _prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = meetingInputSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as MeetingFormState["fieldErrors"] };
  }

  const user = await requireCurrentUser();

  try {
    await meetingsService.createMeeting(leadId, parsed.data, user.id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to schedule meeting." };
  }

  revalidatePath(`/leads/${leadId}`);
  return {};
}
