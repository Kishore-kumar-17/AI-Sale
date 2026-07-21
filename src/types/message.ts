import { z } from "zod";
import { MessageChannel, MessageSequenceStep } from "@/generated/prisma/enums";

export { MessageChannel, MessageSequenceStep };

export const outreachOutputSchema = z.object({
  whatsappFirst: z.string(),
  whatsappFollowup2: z.string(),
  whatsappFollowup3: z.string(),
  email: z.string(),
  linkedin: z.string(),
  instagramDm: z.string(),
});

export type OutreachOutput = z.infer<typeof outreachOutputSchema>;

export const MESSAGE_SLOTS: {
  key: keyof OutreachOutput;
  channel: MessageChannel;
  sequenceStep: MessageSequenceStep;
  label: string;
}[] = [
  { key: "whatsappFirst", channel: "WHATSAPP", sequenceStep: "FIRST", label: "WhatsApp — First Message" },
  { key: "whatsappFollowup2", channel: "WHATSAPP", sequenceStep: "FOLLOWUP_2", label: "WhatsApp — Follow-up 2" },
  { key: "whatsappFollowup3", channel: "WHATSAPP", sequenceStep: "FOLLOWUP_3", label: "WhatsApp — Follow-up 3" },
  { key: "email", channel: "EMAIL", sequenceStep: "FIRST", label: "Email" },
  { key: "linkedin", channel: "LINKEDIN", sequenceStep: "FIRST", label: "LinkedIn" },
  { key: "instagramDm", channel: "INSTAGRAM_DM", sequenceStep: "FIRST", label: "Instagram DM" },
];
