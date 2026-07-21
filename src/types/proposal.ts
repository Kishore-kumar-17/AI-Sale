import { z } from "zod";
import { ProposalStatus, ProposalExportFormat } from "@/generated/prisma/enums";

export { ProposalStatus, ProposalExportFormat };

export const PROPOSAL_STATUSES: ProposalStatus[] = ["UNANSWERED", "SENT", "ANSWERED"];

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  UNANSWERED: "Unanswered",
  SENT: "Sent",
  ANSWERED: "Answered",
};

export const proposalOutputSchema = z.object({
  introduction: z.string(),
  understandingClient: z.string(),
  problemStatement: z.string(),
  solution: z.string(),
  features: z.array(z.string()),
  timeline: z.array(z.string()),
  pricing: z.string(),
  deliverables: z.array(z.string()),
  support: z.string(),
  terms: z.array(z.string()),
});

export type ProposalOutput = z.infer<typeof proposalOutputSchema>;
