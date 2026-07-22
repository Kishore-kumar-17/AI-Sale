"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUS_LABELS, LEAD_STATUSES, type LeadInput } from "@/types/lead";
import type { LeadFormState } from "./actions";

type Field = {
  name: keyof LeadInput;
  label: string;
  type?: "text" | "email" | "number" | "textarea";
};

const FIELDS: Field[] = [
  { name: "ownerName", label: "Owner Name" },
  { name: "category", label: "Category" },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email", type: "email" },
  { name: "instagram", label: "Instagram" },
  { name: "website", label: "Website" },
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "country", label: "Country" },
  { name: "followers", label: "Followers", type: "number" },
  { name: "businessStatus", label: "Business Status" },
  { name: "leadSource", label: "Lead Source" },
  { name: "dealValue", label: "Deal Value (₹)", type: "number" },
];

export function LeadForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: LeadFormState, formData: FormData) => Promise<LeadFormState>;
  defaultValues?: Partial<LeadInput>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            name="businessName"
            defaultValue={defaultValues?.businessName}
            required
          />
          {state.fieldErrors?.businessName && (
            <p className="text-sm text-destructive">{state.fieldErrors.businessName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={defaultValues?.status ?? "NEW"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {LEAD_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
              defaultValue={defaultValues?.[field.name] as string | number | undefined}
            />
            {state.fieldErrors?.[field.name] && (
              <p className="text-sm text-destructive">{state.fieldErrors[field.name]}</p>
            )}
          </div>
        ))}

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={defaultValues?.notes}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
