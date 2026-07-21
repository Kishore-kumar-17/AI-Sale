"use client";

import { useActionState, useRef } from "react";
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
import { MEETING_TYPE_LABELS, MEETING_TYPES } from "@/types/meeting";
import type { MeetingFormState } from "./meeting-actions";

export function MeetingForm({
  action,
}: {
  action: (state: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, {});
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  // Read the raw date/time inputs at submit time (rather than mirroring them into React
  // state on every change) and combine them in the browser's local timezone into a single
  // ISO instant — avoids the server ever having to guess which timezone the strings meant.
  function handleSubmit() {
    const date = dateRef.current?.value ?? "";
    const time = timeRef.current?.value ?? "";
    if (!hiddenRef.current) return;
    if (!date || !time) {
      hiddenRef.current.value = "";
      return;
    }
    const combined = new Date(`${date}T${time}`);
    hiddenRef.current.value = Number.isNaN(combined.getTime()) ? "" : combined.toISOString();
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>
      )}

      <input type="hidden" name="scheduledAt" ref={hiddenRef} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meetingDate">Meeting Date</Label>
          <Input id="meetingDate" type="date" ref={dateRef} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meetingTime">Meeting Time</Label>
          <Input id="meetingTime" type="time" ref={timeRef} required />
        </div>
        {state.fieldErrors?.scheduledAt && (
          <p className="text-sm text-destructive sm:col-span-2">{state.fieldErrors.scheduledAt}</p>
        )}

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="meetingType">Meeting Type</Label>
          <Select name="meetingType" defaultValue="ONLINE">
            <SelectTrigger id="meetingType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEETING_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {MEETING_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="meetingNotes">Meeting Notes</Label>
          <Textarea id="meetingNotes" name="notes" rows={3} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Scheduling…" : "Schedule Meeting"}
        </Button>
      </div>
    </form>
  );
}
