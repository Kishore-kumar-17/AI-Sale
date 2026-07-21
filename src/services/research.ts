import { prisma } from "@/lib/prisma";
import { generateJson } from "@/lib/ai";
import { researchOutputSchema } from "@/types/research";
import { buildResearchPrompt } from "@/prompts/research";

const RESEARCH_COOLDOWN_MS = 30_000;

export async function getResearchByLeadId(leadId: string) {
  return prisma.research.findUnique({ where: { leadId } });
}

export async function generateResearchForLead(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    throw new Error("Lead not found");
  }

  const existing = await prisma.research.findUnique({ where: { leadId } });
  if (existing && Date.now() - existing.generatedAt.getTime() < RESEARCH_COOLDOWN_MS) {
    throw new Error("Research was just generated for this lead — please wait a bit before regenerating.");
  }

  const { system, user } = buildResearchPrompt(lead);
  const json = await generateJson(system, user);

  const parsed = researchOutputSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("AI response did not match the expected research schema");
  }

  return prisma.research.upsert({
    where: { leadId },
    create: { leadId, ...parsed.data },
    update: { ...parsed.data, generatedAt: new Date() },
  });
}
