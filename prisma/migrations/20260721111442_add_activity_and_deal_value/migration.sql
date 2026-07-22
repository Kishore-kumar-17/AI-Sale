-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LEAD_CREATED', 'LEAD_STATUS_CHANGED', 'RESEARCH_GENERATED', 'OUTREACH_GENERATED', 'MEETING_SCHEDULED', 'PROPOSAL_GENERATED', 'PROPOSAL_STATUS_CHANGED', 'TASK_COMPLETED');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "dealValue" INTEGER;

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_leadId_idx" ON "Activity"("leadId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
