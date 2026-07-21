import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { researchOutputSchema } from "@/types/research";
import { buildResearchPrompt } from "@/prompts/research";

const RESEARCH_COOLDOWN_MS = 30_000;

function getAiConfig() {
  if (process.env.NVIDIA_API_KEY) {
    return {
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
      model: process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: undefined,
      model: "gpt-4o-mini",
    };
  }
  throw new Error("No AI provider configured — set NVIDIA_API_KEY or OPENAI_API_KEY");
}

function extractJsonObject(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1] : trimmed;
  return JSON.parse(jsonText);
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

  const { apiKey, baseURL, model } = getAiConfig();
  const client = new OpenAI({ apiKey, baseURL });
  const { system, user } = buildResearchPrompt(lead);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const content = completion.choices[0]?.message.content;
  if (!content) {
    throw new Error("AI returned an empty response");
  }

  let json: unknown;
  try {
    json = extractJsonObject(content);
  } catch {
    throw new Error("AI did not return valid JSON");
  }

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
