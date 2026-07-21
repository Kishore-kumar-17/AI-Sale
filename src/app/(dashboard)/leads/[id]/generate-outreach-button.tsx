"use client";

import { useActionState } from "react";
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateOutreachAction, type OutreachActionState } from "./outreach-actions";

export function GenerateOutreachButton({
  leadId,
  hasMessages,
}: {
  leadId: string;
  hasMessages: boolean;
}) {
  const [state, formAction, isPending] = useActionState<OutreachActionState, FormData>(
    generateOutreachAction.bind(null, leadId),
    null
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <Button type="submit" variant={hasMessages ? "outline" : "default"} disabled={isPending}>
        <MessageSquareText className="size-4" />
        {isPending ? "Generating…" : hasMessages ? "Regenerate Messages" : "Generate Outreach Messages"}
      </Button>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
