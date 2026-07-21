"use client";

import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateResearchAction, type ResearchActionState } from "./research-actions";

export function GenerateResearchButton({
  leadId,
  hasResearch,
}: {
  leadId: string;
  hasResearch: boolean;
}) {
  const [state, formAction, isPending] = useActionState<ResearchActionState, FormData>(
    generateResearchAction.bind(null, leadId),
    null
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <Button type="submit" variant={hasResearch ? "outline" : "default"} disabled={isPending}>
        <Sparkles className="size-4" />
        {isPending ? "Generating…" : hasResearch ? "Regenerate Research" : "Generate Research"}
      </Button>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
