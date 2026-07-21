"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as outreachService from "@/services/outreach";

export type OutreachActionState = { error?: string } | null;

export async function generateOutreachAction(
  leadId: string,
  // useActionState always calls the action with (prevState, formData); neither is needed here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: OutreachActionState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<OutreachActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in." };
  }

  try {
    await outreachService.generateOutreachForLead(leadId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to generate outreach messages." };
  }

  revalidatePath(`/leads/${leadId}`);
  return null;
}
