import { prisma } from "@/lib/prisma";
import { generateJson } from "@/lib/ai";
import { logActivity } from "@/services/activity";
import { outreachOutputSchema, MESSAGE_SLOTS } from "@/types/message";
import { buildOutreachPrompt } from "@/prompts/outreach";

const OUTREACH_COOLDOWN_MS = 30_000;

export async function getMessagesByLeadId(leadId: string) {
  return prisma.message.findMany({ where: { leadId } });
}

export async function generateOutreachForLead(leadId: string) {
  const [lead, research] = await Promise.all([
    prisma.lead.findUnique({ where: { id: leadId } }),
    prisma.research.findUnique({ where: { leadId } }),
  ]);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const existing = await prisma.message.findFirst({
    where: { leadId },
    orderBy: { generatedAt: "desc" },
  });
  if (existing && Date.now() - existing.generatedAt.getTime() < OUTREACH_COOLDOWN_MS) {
    throw new Error("Messages were just generated for this lead — please wait a bit before regenerating.");
  }

  const { system, user } = buildOutreachPrompt(lead, research);
  const json = await generateJson(system, user);

  const parsed = outreachOutputSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("AI response did not match the expected outreach schema");
  }

  const generatedAt = new Date();

  const messages = await prisma.$transaction(
    MESSAGE_SLOTS.map((slot) =>
      prisma.message.upsert({
        where: {
          leadId_channel_sequenceStep: {
            leadId,
            channel: slot.channel,
            sequenceStep: slot.sequenceStep,
          },
        },
        create: {
          leadId,
          channel: slot.channel,
          sequenceStep: slot.sequenceStep,
          content: parsed.data[slot.key],
          generatedAt,
        },
        update: {
          content: parsed.data[slot.key],
          generatedAt,
        },
      })
    )
  );

  await logActivity({
    leadId,
    type: "OUTREACH_GENERATED",
    description: `Outreach messages generated for ${lead.businessName}`,
  });

  return messages;
}
