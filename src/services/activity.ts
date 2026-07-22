import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@/generated/prisma/enums";

export async function logActivity(params: {
  leadId?: string;
  type: ActivityType;
  description: string;
}) {
  await prisma.activity.create({
    data: {
      leadId: params.leadId,
      type: params.type,
      description: params.description,
    },
  });
}

export async function getRecentActivity(limit = 10) {
  return prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
