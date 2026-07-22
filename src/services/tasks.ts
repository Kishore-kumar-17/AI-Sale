import { prisma } from "@/lib/prisma";
import { logActivity } from "@/services/activity";
import type { TaskType } from "@/generated/prisma/enums";

const DAY_MS = 24 * 60 * 60 * 1000;

async function createReminderIfMissing(params: {
  leadId: string;
  type: TaskType;
  title: string;
  dueDate: Date;
  meetingId?: string;
}): Promise<boolean> {
  const existing = await prisma.task.findFirst({
    where: {
      leadId: params.leadId,
      type: params.type,
      completed: false,
      ...(params.meetingId ? { meetingId: params.meetingId } : {}),
    },
  });
  if (existing) return false;

  await prisma.task.create({
    data: {
      leadId: params.leadId,
      type: params.type,
      title: params.title,
      dueDate: params.dueDate,
      meetingId: params.meetingId,
    },
  });
  return true;
}

// Reminders only — per the Critical Safety Rule in docs/phases/phase-07-followup-automation.md,
// this never sends anything to a lead. It only ever creates Task rows for a human to act on.
export async function generateFollowUpReminders(): Promise<{ created: number }> {
  const now = new Date();
  let created = 0;

  // Rules 1 & 2: a lead stuck in CONTACTED for 3 / 7 days with no status progress.
  const staleContacted = await prisma.lead.findMany({
    where: { status: "CONTACTED" },
  });
  for (const lead of staleContacted) {
    const daysSince = (now.getTime() - lead.statusChangedAt.getTime()) / DAY_MS;

    if (daysSince >= 3) {
      const madeOne = await createReminderIfMissing({
        leadId: lead.id,
        type: "NO_RESPONSE_3_DAYS",
        title: `Follow up with ${lead.businessName} — no response in 3 days`,
        dueDate: now,
      });
      if (madeOne) created += 1;
    }
    if (daysSince >= 7) {
      const madeOne = await createReminderIfMissing({
        leadId: lead.id,
        type: "NO_RESPONSE_7_DAYS",
        title: `Follow up with ${lead.businessName} — still no response after 7 days`,
        dueDate: now,
      });
      if (madeOne) created += 1;
    }
  }

  // Rule 3: a proposal sent but unanswered for 5+ days.
  const sentProposals = await prisma.proposal.findMany({
    where: { status: "SENT", sentAt: { not: null } },
    include: { lead: true },
  });
  for (const proposal of sentProposals) {
    const daysSince = (now.getTime() - proposal.sentAt!.getTime()) / DAY_MS;
    if (daysSince >= 5) {
      const madeOne = await createReminderIfMissing({
        leadId: proposal.leadId,
        type: "PROPOSAL_UNANSWERED_5_DAYS",
        title: `Proposal to ${proposal.lead.businessName} unanswered after 5 days`,
        dueDate: now,
      });
      if (madeOne) created += 1;
    }
  }

  // Rule 4: a meeting scheduled for tomorrow (calendar day).
  const startOfTomorrow = new Date(now);
  startOfTomorrow.setHours(24, 0, 0, 0);
  const startOfDayAfterTomorrow = new Date(startOfTomorrow.getTime() + DAY_MS);

  const meetingsTomorrow = await prisma.meeting.findMany({
    where: { scheduledAt: { gte: startOfTomorrow, lt: startOfDayAfterTomorrow } },
    include: { lead: true },
  });
  for (const meeting of meetingsTomorrow) {
    const madeOne = await createReminderIfMissing({
      leadId: meeting.leadId,
      type: "MEETING_TOMORROW",
      title: `Meeting with ${meeting.lead.businessName} tomorrow at ${meeting.scheduledAt.toLocaleTimeString()}`,
      dueDate: meeting.scheduledAt,
      meetingId: meeting.id,
    });
    if (madeOne) created += 1;
  }

  return { created };
}

export async function getIncompleteTasks() {
  return prisma.task.findMany({
    where: { completed: false },
    include: { lead: true },
    orderBy: { dueDate: "asc" },
  });
}

export async function completeTask(taskId: string) {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { completed: true, completedAt: new Date() },
  });

  await logActivity({
    leadId: task.leadId,
    type: "TASK_COMPLETED",
    description: `Reminder completed: ${task.title}`,
  });

  return task;
}
