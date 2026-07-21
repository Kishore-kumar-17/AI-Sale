type ResearchPromptLead = {
  businessName: string;
  category: string | null;
  instagram: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  businessStatus: string | null;
};

const SYSTEM_PROMPT = `You are a business analyst helping a sales team prepare outreach.
Given basic details about a business, produce a structured research brief that reads
like an informed analyst's best assessment. You do not have live web access, so infer
from the business name, category, location, and any handles/links provided — do not
invent specific facts (like exact revenue or employee counts) you cannot reasonably infer.
Keep every list entry short (a few words to one sentence). Be concrete and specific to
this business rather than generic.`;

export function buildResearchPrompt(lead: ResearchPromptLead) {
  const details = [
    `Business Name: ${lead.businessName}`,
    lead.category && `Category: ${lead.category}`,
    lead.instagram && `Instagram: ${lead.instagram}`,
    lead.website && `Website: ${lead.website}`,
    [lead.city, lead.state, lead.country].filter(Boolean).join(", ") &&
      `Location: ${[lead.city, lead.state, lead.country].filter(Boolean).join(", ")}`,
    lead.businessStatus && `Business Status: ${lead.businessStatus}`,
  ]
    .filter(Boolean)
    .join("\n");

  const userPrompt = `Business details:\n${details}\n\nProduce the research brief covering: a business summary, likely products, likely services, target audience, strengths, weaknesses, website improvement suggestions, recommended pages to add, possible pain points this business may have, a suggested outreach CTA, a recommended color palette (as hex codes) for their branding, SEO opportunities, and Google ranking opportunities.`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}
