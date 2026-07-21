-- CreateTable
CREATE TABLE "Research" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "businessSummary" TEXT NOT NULL,
    "products" TEXT[],
    "services" TEXT[],
    "targetAudience" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "websiteSuggestions" TEXT[],
    "recommendedPages" TEXT[],
    "possiblePainPoints" TEXT[],
    "suggestedCta" TEXT NOT NULL,
    "recommendedColorPalette" TEXT[],
    "seoOpportunities" TEXT[],
    "googleRankingOpportunities" TEXT[],
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Research_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Research_leadId_key" ON "Research"("leadId");

-- AddForeignKey
ALTER TABLE "Research" ADD CONSTRAINT "Research_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
