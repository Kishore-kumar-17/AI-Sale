type OutreachPromptLead = {
  businessName: string;
  ownerName: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

type OutreachPromptResearch = {
  businessSummary: string;
  strengths: string[];
  weaknesses: string[];
  possiblePainPoints: string[];
  websiteSuggestions: string[];
} | null;

const SYSTEM_PROMPT = `You are writing cold outreach on behalf of Nexivra Tech, a website
design and SEO/digital marketing agency, reaching out to a local business (the "lead") to
start a conversation about improving their website and online presence.

Rules for every message you write:
- Human tone — write like a real person, not a company.
- No emojis.
- No AI-sounding phrases or clichés (e.g. "I hope this message finds you well", "unlock your
  potential", "take your business to the next level", "as an AI", "in today's digital age").
- Mention exactly one specific observation about the business (something concrete, not generic).
- Mention the business by name.
- Mention exactly one benefit of working with Nexivra Tech, tied to that observation
  (e.g. a better website, more local customers finding them online, stronger Google ranking).
- Maximum 150 words.
- End with a soft, low-pressure call-to-action (e.g. asking if they're open to a quick chat) —
  never pushy or salesy.
- Every version must be genuinely different from the others — different wording, different
  angle, not the same message reworded.

You must write 6 distinct versions:
1. whatsappFirst — the first WhatsApp message, casual and short.
2. whatsappFollowup2 — a WhatsApp follow-up sent a few days later if there was no reply.
   Take a different angle than the first message (e.g. a different observation or benefit).
   Keep it brief and low-pressure.
3. whatsappFollowup3 — a final WhatsApp follow-up. Even shorter, warmly closing the loop
   (e.g. "no worries if now isn't the right time — happy to reconnect later").
4. email — slightly more structured than WhatsApp, still warm and human. Format it as a
   short "Subject: ..." line, then a blank line, then the body.
5. linkedin — professional tone suited to LinkedIn, still human and not corporate-sounding.
6. instagramDm — very casual and short, like a real DM someone would type on Instagram.

Respond with ONLY a single raw JSON object — no markdown code fences, no commentary before
or after it — with exactly these keys, all string values:
{
  "whatsappFirst": string,
  "whatsappFollowup2": string,
  "whatsappFollowup3": string,
  "email": string,
  "linkedin": string,
  "instagramDm": string
}`;

export function buildOutreachPrompt(lead: OutreachPromptLead, research: OutreachPromptResearch) {
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
      ]
        .filter(Boolean)
        .join("\n")
    : null;

  const userPrompt = `Business details:\n${details}\n\n${
    researchNotes
      ? `Research notes to draw one observation from (pick ONE per message, vary it across messages):\n${researchNotes}\n\n`
      : `No research notes are available yet — base the one observation on the business's category and location.\n\n`
  }Write the 6 outreach message versions described in the system prompt.`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}
