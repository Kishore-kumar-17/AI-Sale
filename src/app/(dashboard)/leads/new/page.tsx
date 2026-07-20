import { LeadForm } from "../lead-form";
import { createLeadAction } from "../actions";

export default function NewLeadPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Add Lead</h1>
      <LeadForm action={createLeadAction} submitLabel="Create Lead" />
    </div>
  );
}
