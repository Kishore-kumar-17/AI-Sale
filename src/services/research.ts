import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { prisma } from "@/lib/prisma";
import { researchOutputSchema } from "@/types/research";
import { buildResearchPrompt } from "@/prompts/research";

const RESEARCH_COOLDOWN_MS = 30_000;
const MODEL = "gpt-4o-mini";

function getOpenAiClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

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

  const client = getOpenAiClient();
  const { system, user } = buildResearchPrompt(lead);

  const completion = await client.chat.completions.parse({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: zodResponseFormat(researchOutputSchema, "business_research"),
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) {
    throw new Error("AI did not return a valid research output");
  }

  return prisma.research.upsert({
    where: { leadId },
    create: { leadId, ...parsed },
    update: { ...parsed, generatedAt: new Date() },
  });
}
