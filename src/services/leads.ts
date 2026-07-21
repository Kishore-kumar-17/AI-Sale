import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { LeadFilters, LeadInput } from "@/types/lead";

function toNullable(value: string | undefined): string | null {
  return value && value.length > 0 ? value : null;
}

function toLeadData(input: LeadInput) {
  return {
    businessName: input.businessName.trim(),
    ownerName: toNullable(input.ownerName),
    category: toNullable(input.category),
    phone: toNullable(input.phone),
    email: toNullable(input.email),
    instagram: toNullable(input.instagram),
    website: toNullable(input.website),
    address: toNullable(input.address),
    city: toNullable(input.city),
    state: toNullable(input.state),
    country: toNullable(input.country),
    followers:
      input.followers === "" || input.followers === undefined
        ? null
        : input.followers,
    businessStatus: toNullable(input.businessStatus),
    leadSource: toNullable(input.leadSource),
    notes: toNullable(input.notes),
    status: input.status,
  };
}

function buildWhere(filters: Pick<LeadFilters, "search" | "status" | "category">) {
  const where: Prisma.LeadWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: "insensitive" };
  }

  if (filters.search) {
    where.OR = [
      { businessName: { contains: filters.search, mode: "insensitive" } },
      { ownerName: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
      { city: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getLeads(filters: LeadFilters) {
  const where = buildWhere(filters);

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total };
}

export async function getAllLeadsForExport(
  filters: Pick<LeadFilters, "search" | "status" | "category">
) {
  return prisma.lead.findMany({
    where: buildWhere(filters),
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({ where: { id } });
}

export async function createLead(input: LeadInput, createdById: string) {
  return prisma.lead.create({
    data: { ...toLeadData(input), createdById },
  });
}

export async function updateLead(id: string, input: LeadInput) {
  const current = await prisma.lead.findUnique({ where: { id }, select: { status: true } });
  const statusChanged = current !== null && current.status !== input.status;

  return prisma.lead.update({
    where: { id },
    data: {
      ...toLeadData(input),
      ...(statusChanged ? { statusChangedAt: new Date() } : {}),
    },
  });
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } });
}

export async function getLeadStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [total, todayCount, wonCount] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.lead.count({ where: { status: "WON" } }),
  ]);

  const conversionRate = total === 0 ? 0 : Math.round((wonCount / total) * 100);

  return { total, todayCount, conversionRate };
}
