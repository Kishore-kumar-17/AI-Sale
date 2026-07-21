import { prisma } from "@/lib/prisma";
import { generateJson } from "@/lib/ai";
import { proposalOutputSchema, type ProposalStatus } from "@/types/proposal";
import { buildProposalPrompt } from "@/prompts/proposal";

const PROPOSAL_COOLDOWN_MS = 30_000;

export async function getProposalByLeadId(leadId: string) {
  return prisma.proposal.findUnique({ where: { leadId } });
}

export async function generateProposalForLead(leadId: string) {
  const [lead, research] = await Promise.all([
    prisma.lead.findUnique({ where: { id: leadId } }),
    prisma.research.findUnique({ where: { leadId } }),
  ]);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const existing = await prisma.proposal.findUnique({ where: { leadId } });
  if (existing && Date.now() - existing.generatedAt.getTime() < PROPOSAL_COOLDOWN_MS) {
    throw new Error("A proposal was just generated for this lead — please wait a bit before regenerating.");
  }

  const { system, user } = buildProposalPrompt(lead, research);
  const json = await generateJson(system, user);

  const parsed = proposalOutputSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("AI response did not match the expected proposal schema");
  }

  return prisma.proposal.upsert({
    where: { leadId },
    create: { leadId, ...parsed.data },
    update: {
      ...parsed.data,
      generatedAt: new Date(),
      status: "UNANSWERED",
      lastExportedFormat: null,
      lastExportedAt: null,
    },
  });
}

export async function updateProposalStatus(leadId: string, status: ProposalStatus) {
  const proposal = await prisma.proposal.update({
    where: { leadId },
    data: { status },
  });

  if (status === "SENT") {
    await prisma.lead.update({ where: { id: leadId }, data: { status: "PROPOSAL_SENT" } });
  }

  return proposal;
}

export async function recordProposalExport(leadId: string, format: "PDF" | "DOCX") {
  await prisma.proposal.update({
    where: { leadId },
    data: { lastExportedFormat: format, lastExportedAt: new Date() },
  });
}
