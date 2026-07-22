import { prisma } from "@/lib/prisma";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/types/lead";

export async function getDashboardStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalLeads, todayLeads, wonCount, totalMeetings, upcomingMeetings, revenue] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.lead.count({ where: { status: "WON" } }),
      prisma.meeting.count(),
      prisma.meeting.count({ where: { scheduledAt: { gte: new Date() } } }),
      prisma.lead.aggregate({
        where: { status: "WON" },
        _sum: { dealValue: true },
      }),
    ]);

  const conversionRate = totalLeads === 0 ? 0 : Math.round((wonCount / totalLeads) * 100);

  return {
    totalLeads,
    todayLeads,
    totalMeetings,
    upcomingMeetings,
    revenue: revenue._sum.dealValue ?? 0,
    conversionRate,
  };
}

export async function getTopIndustries(limit = 5) {
  const grouped = await prisma.lead.groupBy({
    by: ["category"],
    where: { category: { not: null } },
    _count: { category: true },
    orderBy: { _count: { category: "desc" } },
    take: limit,
  });

  return grouped.map((g) => ({ category: g.category as string, count: g._count.category }));
}

export async function getTopPerformer() {
  const grouped = await prisma.lead.groupBy({
    by: ["createdById"],
    where: { status: "WON" },
    _count: { _all: true },
    _sum: { dealValue: true },
    orderBy: { _sum: { dealValue: "desc" } },
    take: 1,
  });

  if (grouped.length === 0) return null;

  const top = grouped[0];
  const user = await prisma.user.findUnique({ where: { id: top.createdById } });

  return {
    name: user?.name ?? user?.email ?? "Unknown",
    wonCount: top._count._all,
    revenue: top._sum.dealValue ?? 0,
  };
}

export async function getLeadFunnel() {
  const counts = await prisma.lead.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countByStatus = new Map(counts.map((c) => [c.status, c._count._all]));

  return LEAD_STATUSES.map((status) => ({
    status,
    label: LEAD_STATUS_LABELS[status],
    count: countByStatus.get(status) ?? 0,
  }));
}

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getLeadsTrend(days = 14) {
  // Bucket entirely in UTC-day terms — mixing local-timezone date math (setHours/setDate)
  // with toISOString()'s UTC-day extraction silently shifted every bucket by a day for any
  // server timezone with a non-zero UTC offset, making today's leads vanish from the chart.
  const now = new Date();
  const todayUtcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const startUtcMs = todayUtcMidnight - (days - 1) * DAY_MS;
  const startDate = new Date(startUtcMs);

  const leads = await prisma.lead.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true },
  });

  const countByDay = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const key = new Date(startUtcMs + i * DAY_MS).toISOString().slice(0, 10);
    countByDay.set(key, 0);
  }
  for (const lead of leads) {
    const key = lead.createdAt.toISOString().slice(0, 10);
    countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
  }

  return Array.from(countByDay.entries()).map(([date, count]) => ({ date, count }));
}

export async function getUpcomingMeetings(limit = 5) {
  return prisma.meeting.findMany({
    where: { scheduledAt: { gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
    take: limit,
    include: { lead: true },
  });
}
