"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import * as leadsService from "@/services/leads";
import { leadInputSchema, type LeadInput } from "@/types/lead";

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

export type LeadFormState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof LeadInput, string>>;
};

function parseLeadForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return leadInputSchema.safeParse(raw);
}

export async function createLeadAction(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = parseLeadForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as LeadFormState["fieldErrors"] };
  }

  const user = await requireCurrentUser();
  const lead = await leadsService.createLead(parsed.data, user.id);

  revalidatePath("/leads");
  redirect(`/leads/${lead.id}`);
}

export async function updateLeadAction(
  id: string,
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = parseLeadForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as LeadFormState["fieldErrors"] };
  }

  await requireCurrentUser();
  await leadsService.updateLead(id, parsed.data);

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}`);
}

export async function deleteLeadAction(id: string) {
  await requireCurrentUser();
  await leadsService.deleteLead(id);
  revalidatePath("/leads");
  redirect("/leads");
}
