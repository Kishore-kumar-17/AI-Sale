type ProposalPromptLead = {
  businessName: string;
  ownerName: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

type ProposalPromptResearch = {
  businessSummary: string;
  strengths: string[];
  weaknesses: string[];
  possiblePainPoints: string[];
  websiteSuggestions: string[];
  recommendedPages: string[];
  seoOpportunities: string[];
} | null;

const SYSTEM_PROMPT = `You are writing a client proposal on behalf of Nexivra Tech, a website
design and SEO/digital marketing agency, addressed to a prospective client business (the "lead").

Write in a professional but human tone — confident, clear, and specific to this business, not
generic boilerplate. No emojis. No AI-sounding phrases or clichés.

You must write these 10 sections:
1. introduction — a short, warm opening that names the business and sets up why you're reaching
   out to propose working together.
2. understandingClient — demonstrates genuine understanding of their business, drawing on the
   research notes if provided (or the business's category/location if not).
3. problemStatement — the specific problem(s) or opportunity this business has with their current
   website/online presence.
4. solution — how Nexivra Tech's website design + SEO/digital marketing services solve that
   problem, tailored to this business.
5. features — an array of concrete features/deliverables of the solution (e.g. "Mobile-optimized
   redesign", "Local SEO setup"). 4-8 short items.
6. timeline — an array of project phases with rough durations (e.g. "Week 1-2: Discovery &
   Design"). 3-5 items, in order.
7. pricing — a short plain-text pricing section. Include 2-3 line items with illustrative prices
   in INR (₹) and a total, formatted as readable plain text with line breaks (\\n) between lines.
8. deliverables — an array of concrete things the client will receive (e.g. "Fully responsive
   website", "SEO audit report"). 4-8 short items.
9. support — a short paragraph on post-launch support/maintenance offered.
10. terms — an array of short terms & conditions bullets (e.g. payment schedule, revision policy).
    3-6 items.

Respond with ONLY a single raw JSON object — no markdown code fences, no commentary before or
after it — with exactly these keys:
{
  "introduction": string,
  "understandingClient": string,
  "problemStatement": string,
  "solution": string,
  "features": string[],
  "timeline": string[],
  "pricing": string,
  "deliverables": string[],
  "support": string,
  "terms": string[]
}`;

export function buildProposalPrompt(lead: ProposalPromptLead, research: ProposalPromptResearch) {
  const location = [lead.city, lead.state, lead.country].filter(Boolean).join(", ");

  const details = [
    `Business Name: ${lead.businessName}`,
    lead.ownerName && `Owner Name: ${lead.ownerName}`,
    lead.category && `Category: ${lead.category}`,
    location && `Location: ${location}`,
  ]
    .filter(Boolean)
    .join("\n");

  const researchNotes = research
    ? [
        `Business Summary: ${research.businessSummary}`,
        research.strengths.length && `Strengths: ${research.strengths.join("; ")}`,
        research.weaknesses.length && `Weaknesses: ${research.weaknesses.join("; ")}`,
        research.possiblePainPoints.length &&
          `Possible Pain Points: ${research.possiblePainPoints.join("; ")}`,
        research.websiteSuggestions.length &&
          `Website Suggestions: ${research.websiteSuggestions.join("; ")}`,
        research.recommendedPages.length &&
          `Recommended Pages: ${research.recommendedPages.join("; ")}`,
        research.seoOpportunities.length && `SEO Opportunities: ${research.seoOpportunities.join("; ")}`,
      ]
        .filter(Boolean)
        .join("\n")
    : null;

  const userPrompt = `Business details:\n${details}\n\n${
    researchNotes
      ? `Research notes to ground the proposal in specifics:\n${researchNotes}\n\n`
      : `No research notes are available yet — base the proposal on the business's category and location.\n\n`
  }Write the full 10-section proposal described in the system prompt.`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}
