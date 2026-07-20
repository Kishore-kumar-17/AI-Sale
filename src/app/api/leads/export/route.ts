import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllLeadsForExport } from "@/services/leads";
import { LEAD_STATUS_LABELS, leadFiltersSchema, type LeadStatus } from "@/types/lead";

const CSV_COLUMNS = [
  "businessName",
  "ownerName",
  "category",
  "phone",
  "email",
  "instagram",
  "website",
  "address",
  "city",
  "state",
  "country",
  "followers",
  "businessStatus",
  "leadSource",
  "notes",
  "status",
  "createdAt",
  "updatedAt",
] as const;

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filters = leadFiltersSchema.parse({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    category: searchParams.get("category") ?? undefined,
  });

  const leads = await getAllLeadsForExport(filters);

  const rows = leads.map((lead) =>
    CSV_COLUMNS.map((column) => {
      if (column === "status") {
        return escapeCsvValue(LEAD_STATUS_LABELS[lead.status as LeadStatus]);
      }
      const value = lead[column];
      return escapeCsvValue(value instanceof Date ? value.toISOString() : value);
    }).join(",")
  );

  const csv = [CSV_COLUMNS.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-export-${Date.now()}.csv"`,
    },
  });
}
