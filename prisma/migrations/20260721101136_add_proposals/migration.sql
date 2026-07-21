-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('UNANSWERED', 'SENT', 'ANSWERED');

-- CreateEnum
CREATE TYPE "ProposalExportFormat" AS ENUM ('PDF', 'DOCX');

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "understandingClient" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "features" TEXT[],
    "timeline" TEXT[],
    "pricing" TEXT NOT NULL,
    "deliverables" TEXT[],
    "support" TEXT NOT NULL,
    "terms" TEXT[],
    "status" "ProposalStatus" NOT NULL DEFAULT 'UNANSWERED',
    "lastExportedFormat" "ProposalExportFormat",
    "lastExportedAt" TIMESTAMP(3),
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_leadId_key" ON "Proposal"("leadId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
