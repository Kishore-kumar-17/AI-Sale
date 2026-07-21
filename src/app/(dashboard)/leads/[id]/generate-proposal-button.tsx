"use client";

import { useActionState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateProposalAction, type ProposalActionState } from "./proposal-actions";

export function GenerateProposalButton({
  leadId,
  hasProposal,
}: {
  leadId: string;
  hasProposal: boolean;
}) {
  const [state, formAction, isPending] = useActionState<ProposalActionState, FormData>(
    generateProposalAction.bind(null, leadId),
    null
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <Button type="submit" variant={hasProposal ? "outline" : "default"} disabled={isPending}>
        <FileText className="size-4" />
        {isPending ? "Generating…" : hasProposal ? "Regenerate Proposal" : "Generate Proposal"}
      </Button>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
