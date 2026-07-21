import { TaskType } from "@/generated/prisma/enums";

export { TaskType };

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  NO_RESPONSE_3_DAYS: "No response in 3 days",
  NO_RESPONSE_7_DAYS: "No response in 7 days",
  PROPOSAL_UNANSWERED_5_DAYS: "Proposal unanswered in 5 days",
  MEETING_TOMORROW: "Meeting tomorrow",
};
