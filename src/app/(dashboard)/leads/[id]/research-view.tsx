import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Research } from "@/generated/prisma/client";

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h3>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ResearchView({ research }: { research: Research }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Business Research</CardTitle>
        <p className="text-xs text-muted-foreground">
          Generated {research.generatedAt.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Business Summary</h3>
          <p className="text-sm">{research.businessSummary}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ListSection title="Products" items={research.products} />
          <ListSection title="Services" items={research.services} />
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Target Audience</h3>
          <p className="text-sm">{research.targetAudience}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ListSection title="Strengths" items={research.strengths} />
          <ListSection title="Weaknesses" items={research.weaknesses} />
        </div>

        <ListSection title="Website Suggestions" items={research.websiteSuggestions} />
        <ListSection title="Recommended Pages" items={research.recommendedPages} />
        <ListSection title="Possible Pain Points" items={research.possiblePainPoints} />

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Suggested CTA</h3>
          <p className="text-sm font-medium">{research.suggestedCta}</p>
        </div>

        {research.recommendedColorPalette.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Recommended Color Palette
            </h3>
            <div className="flex flex-wrap gap-2">
              {research.recommendedColorPalette.map((color, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="size-5 rounded-full border"
                    style={{ backgroundColor: color }}
                  />
                  <Badge variant="secondary">{color}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ListSection title="SEO Opportunities" items={research.seoOpportunities} />
          <ListSection
            title="Google Ranking Opportunities"
            items={research.googleRankingOpportunities}
          />
        </div>
      </CardContent>
    </Card>
  );
}
