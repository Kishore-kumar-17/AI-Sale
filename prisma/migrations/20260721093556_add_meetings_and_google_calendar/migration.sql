-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('NOT_SCHEDULED', 'SCHEDULED', 'SENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleAccessToken" TEXT,
ADD COLUMN     "googleConnectedEmail" TEXT,
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "meetingType" "MeetingType" NOT NULL,
    "notes" TEXT,
    "googleCalendarEventId" TEXT,
    "googleMeetLink" TEXT,
    "reminderStatus" "ReminderStatus" NOT NULL DEFAULT 'NOT_SCHEDULED',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Meeting_leadId_idx" ON "Meeting"("leadId");

-- CreateIndex
CREATE INDEX "Meeting_scheduledAt_idx" ON "Meeting"("scheduledAt");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
