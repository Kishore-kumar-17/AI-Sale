import { notFound } from "next/navigation";
import { getLeadById } from "@/services/leads";
import { getResearchByLeadId } from "@/services/research";
import { getMessagesByLeadId } from "@/services/outreach";
import { getMeetingsByLeadId } from "@/services/meetings";
import { getProposalByLeadId } from "@/services/proposals";
import type { LeadInput } from "@/types/lead";
import { LeadForm } from "../lead-form";
import { updateLeadAction } from "../actions";
import { DeleteLeadButton } from "../delete-lead-button";
import { GenerateResearchButton } from "./generate-research-button";
import { ResearchView } from "./research-view";
import { GenerateOutreachButton } from "./generate-outreach-button";
import { OutreachView } from "./outreach-view";
import { MeetingForm } from "./meeting-form";
import { MeetingsView } from "./meetings-view";
import { scheduleMeetingAction } from "./meeting-actions";
import { GenerateProposalButton } from "./generate-proposal-button";
import { ProposalView } from "./proposal-view";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, research, messages, meetings, proposal] = await Promise.all([
    getLeadById(id),
    getResearchByLeadId(id),
    getMessagesByLeadId(id),
    getMeetingsByLeadId(id),
    getProposalByLeadId(id),
  ]);

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

      <div className="mt-8 flex flex-col gap-4">
        <GenerateResearchButton leadId={id} hasResearch={!!research} />
        {research && <ResearchView research={research} />}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <GenerateOutreachButton leadId={id} hasMessages={messages.length > 0} />
        {messages.length > 0 && <OutreachView messages={messages} />}
      </div>

      {(lead.status !== "NEW" && lead.status !== "CONTACTED") || meetings.length > 0 ? (
        <div className="mt-8 flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Schedule a Meeting</h2>
          <MeetingsView meetings={meetings} />
          <MeetingForm action={scheduleMeetingAction.bind(null, id)} />
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          Meeting scheduling unlocks once this lead&apos;s status is Interested or later.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        <GenerateProposalButton leadId={id} hasProposal={!!proposal} />
        {proposal && <ProposalView leadId={id} proposal={proposal} />}
      </div>
    </div>
  );
}
