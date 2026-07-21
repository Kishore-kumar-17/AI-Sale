import { prisma } from "@/lib/prisma";
import { createCalendarEventForMeeting } from "@/lib/google-calendar";
import type { MeetingInput } from "@/types/meeting";

const DEFAULT_DURATION_MINUTES = 30;

export async function getMeetingsByLeadId(leadId: string) {
  return prisma.meeting.findMany({ where: { leadId }, orderBy: { scheduledAt: "asc" } });
}

export async function createMeeting(leadId: string, input: MeetingInput, createdById: string) {
  const [lead, user] = await Promise.all([
    prisma.lead.findUnique({ where: { id: leadId } }),
    prisma.user.findUnique({ where: { id: createdById } }),
  ]);
  if (!lead) {
    throw new Error("Lead not found");
  }

  let googleResult: { eventId: string | null; meetLink: string | null } | null = null;
  if (user) {
    try {
      googleResult = await createCalendarEventForMeeting({
        user,
        businessName: lead.businessName,
        leadEmail: lead.email,
        scheduledAt: input.scheduledAt,
        durationMinutes: DEFAULT_DURATION_MINUTES,
        meetingType: input.meetingType,
        notes: input.notes || null,
      });
    } catch (err) {
      // Calendar sync is a bonus on top of the CRM record — never block scheduling on it.
      console.error("Failed to create Google Calendar event for meeting:", err);
    }
  }

  const meeting = await prisma.meeting.create({
    data: {
      leadId,
      scheduledAt: input.scheduledAt,
      meetingType: input.meetingType,
      notes: input.notes || null,
      createdById,
      googleCalendarEventId: googleResult?.eventId ?? null,
      googleMeetLink: googleResult?.meetLink ?? null,
      reminderStatus: googleResult?.eventId ? "SCHEDULED" : "NOT_SCHEDULED",
    },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "MEETING_SCHEDULED", statusChangedAt: new Date() },
  });

  return meeting;
}
