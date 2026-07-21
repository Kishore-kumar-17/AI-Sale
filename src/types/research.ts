import { z } from "zod";

export const researchOutputSchema = z.object({
  businessSummary: z.string(),
  products: z.array(z.string()),
  services: z.array(z.string()),
  targetAudience: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  websiteSuggestions: z.array(z.string()),
  recommendedPages: z.array(z.string()),
  possiblePainPoints: z.array(z.string()),
  suggestedCta: z.string(),
  recommendedColorPalette: z.array(z.string()),
  seoOpportunities: z.array(z.string()),
  googleRankingOpportunities: z.array(z.string()),
});

export type ResearchOutput = z.infer<typeof researchOutputSchema>;
