import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROPOSAL_STATUS_LABELS } from "@/types/proposal";
import type { Proposal } from "@/generated/prisma/client";
import { updateProposalStatusAction } from "./proposal-actions";

const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  UNANSWERED: "secondary",
  SENT: "default",
  ANSWERED: "outline",
};

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProposalView({ leadId, proposal }: { leadId: string; proposal: Proposal }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Proposal</CardTitle>
          <Badge variant={STATUS_BADGE_VARIANT[proposal.status]}>
            {PROPOSAL_STATUS_LABELS[proposal.status]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Generated {proposal.generatedAt.toLocaleString()}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" render={<a href={`/api/leads/${leadId}/proposal/export?format=pdf`} />}>
            <Download className="size-4" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" render={<a href={`/api/leads/${leadId}/proposal/export?format=docx`} />}>
            <Download className="size-4" />
            Export DOCX
          </Button>
          {proposal.status === "UNANSWERED" && (
            <form action={updateProposalStatusAction.bind(null, leadId, "SENT")}>
              <Button type="submit" variant="outline" size="sm">
                Mark as Sent
              </Button>
            </form>
          )}
          {proposal.status === "SENT" && (
            <form action={updateProposalStatusAction.bind(null, leadId, "ANSWERED")}>
              <Button type="submit" variant="outline" size="sm">
                Mark as Answered
              </Button>
            </form>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Introduction</h3>
          <p className="text-sm">{proposal.introduction}</p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Understanding Your Business</h3>
          <p className="text-sm">{proposal.understandingClient}</p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Problem Statement</h3>
          <p className="text-sm">{proposal.problemStatement}</p>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Our Solution</h3>
          <p className="text-sm">{proposal.solution}</p>
        </div>

        <ListSection title="Features" items={proposal.features} />
        <ListSection title="Timeline" items={proposal.timeline} />

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Pricing</h3>
          <p className="whitespace-pre-wrap text-sm">{proposal.pricing}</p>
        </div>

        <ListSection title="Deliverables" items={proposal.deliverables} />

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Support</h3>
          <p className="text-sm">{proposal.support}</p>
        </div>

        <ListSection title="Terms & Conditions" items={proposal.terms} />
      </CardContent>
    </Card>
  );
}
