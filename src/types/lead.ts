import { z } from "zod";
import { LeadStatus } from "@/generated/prisma/enums";

export { LeadStatus };

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "MEETING_SCHEDULED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  MEETING_SCHEDULED: "Meeting Scheduled",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
};

const optionalString = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""));

export const leadInputSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required").max(200),
  ownerName: optionalString,
  category: optionalString,
  phone: optionalString,
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(200)
    .optional()
    .or(z.literal("")),
  instagram: optionalString,
  website: optionalString,
  address: optionalString,
  city: optionalString,
  state: optionalString,
  country: optionalString,
  followers: z
    .union([z.coerce.number().int().min(0).max(1_000_000_000), z.literal("")])
    .optional(),
  businessStatus: optionalString,
  leadSource: optionalString,
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
  status: z.enum(LEAD_STATUSES as [LeadStatus, ...LeadStatus[]]),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const leadFiltersSchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(LEAD_STATUSES as [LeadStatus, ...LeadStatus[]]).optional(),
  category: z.string().trim().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type LeadFilters = z.infer<typeof leadFiltersSchema>;
