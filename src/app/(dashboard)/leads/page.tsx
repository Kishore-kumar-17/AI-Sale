import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getLeads } from "@/services/leads";
import { LEAD_STATUS_LABELS, parseLeadFilters } from "@/types/lead";
import { LeadFilters } from "./lead-filters";
import { DeleteLeadButton } from "./delete-lead-button";

const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  NEW: "secondary",
  CONTACTED: "secondary",
  INTERESTED: "default",
  MEETING_SCHEDULED: "default",
  PROPOSAL_SENT: "default",
  WON: "default",
  LOST: "destructive",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseLeadFilters({
    search: typeof params.search === "string" ? params.search : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
  });

  const { leads, total } = await getLeads(filters);
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  const exportParams = new URLSearchParams();
  if (filters.search) exportParams.set("search", filters.search);
  if (filters.status) exportParams.set("status", filters.status);
  if (filters.category) exportParams.set("category", filters.category);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">{total} total leads</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            render={<a href={`/api/leads/export?${exportParams.toString()}`} />}
          >
            <Download className="size-4" />
            Export CSV
          </Button>
          <Button render={<Link href="/leads/new" />}>
            <Plus className="size-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <LeadFilters
        initialSearch={filters.search ?? ""}
        initialStatus={filters.status ?? ""}
        initialCategory={filters.category ?? ""}
      />

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  <Link href={`/leads/${lead.id}`} className="hover:underline">
                    {lead.businessName}
                  </Link>
                </TableCell>
                <TableCell>{lead.ownerName ?? "—"}</TableCell>
                <TableCell>{lead.category ?? "—"}</TableCell>
                <TableCell>{lead.email ?? lead.phone ?? "—"}</TableCell>
                <TableCell>{lead.city ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[lead.status]}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DeleteLeadButton leadId={lead.id} businessName={lead.businessName} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            const pageParams = new URLSearchParams(exportParams);
            pageParams.set("page", String(page));
            return (
              <Button
                key={page}
                variant={page === filters.page ? "default" : "outline"}
                size="sm"
                render={<Link href={`/leads?${pageParams.toString()}`} />}
              >
                {page}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
