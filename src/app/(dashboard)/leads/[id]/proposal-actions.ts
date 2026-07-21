"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as proposalsService from "@/services/proposals";
import type { ProposalStatus } from "@/types/proposal";

export type ProposalActionState = { error?: string } | null;

export async function generateProposalAction(
  leadId: string,
  // useActionState always calls the action with (prevState, formData); neither is needed here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ProposalActionState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<ProposalActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in." };
  }

  try {
    await proposalsService.generateProposalForLead(leadId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to generate proposal." };
  }

  revalidatePath(`/leads/${leadId}`);
  return null;
}

export async function updateProposalStatusAction(leadId: string, status: ProposalStatus) {
  const { userId } = await auth();
  if (!userId) return;

  await proposalsService.updateProposalStatus(leadId, status);
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
}
