"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as researchService from "@/services/research";

export type ResearchActionState = { error?: string } | null;

export async function generateResearchAction(
  leadId: string,
  // useActionState always calls the action with (prevState, formData); neither is needed here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ResearchActionState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData
): Promise<ResearchActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in." };
  }

  try {
    await researchService.generateResearchForLead(leadId);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to generate research." };
  }

  revalidatePath(`/leads/${leadId}`);
  return null;
}
