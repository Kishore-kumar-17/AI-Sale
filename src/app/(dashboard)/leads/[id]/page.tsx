import { notFound } from "next/navigation";
import { getLeadById } from "@/services/leads";
import type { LeadInput } from "@/types/lead";
import { LeadForm } from "../lead-form";
import { updateLeadAction } from "../actions";
import { DeleteLeadButton } from "../delete-lead-button";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  const defaultValues: Partial<LeadInput> = {
    businessName: lead.businessName,
    ownerName: lead.ownerName ?? undefined,
    category: lead.category ?? undefined,
    phone: lead.phone ?? undefined,
    email: lead.email ?? undefined,
    instagram: lead.instagram ?? undefined,
    website: lead.website ?? undefined,
    address: lead.address ?? undefined,
    city: lead.city ?? undefined,
    state: lead.state ?? undefined,
    country: lead.country ?? undefined,
    followers: lead.followers ?? undefined,
    businessStatus: lead.businessStatus ?? undefined,
    leadSource: lead.leadSource ?? undefined,
    notes: lead.notes ?? undefined,
    status: lead.status,
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{lead.businessName}</h1>
        <DeleteLeadButton leadId={lead.id} businessName={lead.businessName} />
      </div>
      <LeadForm
        action={updateLeadAction.bind(null, id)}
        defaultValues={defaultValues}
        submitLabel="Save Changes"
      />
    </div>
  );
}
