import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEETING_TYPE_LABELS } from "@/types/meeting";
import type { Meeting } from "@/generated/prisma/client";

export function MeetingsView({ meetings }: { meetings: Meeting[] }) {
  if (meetings.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meetings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="rounded-lg border p-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-medium">{meeting.scheduledAt.toLocaleString()}</span>
              <Badge variant="secondary">{MEETING_TYPE_LABELS[meeting.meetingType]}</Badge>
              {meeting.googleCalendarEventId ? (
                <Badge variant="default">Google Calendar synced</Badge>
              ) : (
                <Badge variant="outline">Not synced to Google Calendar</Badge>
              )}
            </div>
            {meeting.googleMeetLink && (
              <a
                href={meeting.googleMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Join Google Meet
              </a>
            )}
            {meeting.notes && <p className="mt-2 text-sm text-muted-foreground">{meeting.notes}</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
