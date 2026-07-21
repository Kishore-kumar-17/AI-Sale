-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('WHATSAPP', 'EMAIL', 'LINKEDIN', 'INSTAGRAM_DM');

-- CreateEnum
CREATE TYPE "MessageSequenceStep" AS ENUM ('FIRST', 'FOLLOWUP_2', 'FOLLOWUP_3');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "sequenceStep" "MessageSequenceStep" NOT NULL DEFAULT 'FIRST',
    "content" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_leadId_idx" ON "Message"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_leadId_channel_sequenceStep_key" ON "Message"("leadId", "channel", "sequenceStep");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
