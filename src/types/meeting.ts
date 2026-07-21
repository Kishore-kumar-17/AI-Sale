import { z } from "zod";
import { MeetingType } from "@/generated/prisma/enums";

export { MeetingType };

export const MEETING_TYPES: MeetingType[] = ["ONLINE", "OFFLINE"];

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  ONLINE: "Online",
  OFFLINE: "Offline",
};

export const meetingInputSchema = z.object({
  // Built client-side from separate date + time inputs (in the user's local timezone)
  // into a single ISO instant, so scheduling isn't silently misinterpreted in the
  // server's timezone.
  scheduledAt: z.coerce
    .date()
    .refine((date) => date.getTime() > Date.now(), "Meeting time must be in the future"),
  meetingType: z.enum(MEETING_TYPES as [MeetingType, ...MeetingType[]]),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type MeetingInput = z.infer<typeof meetingInputSchema>;
