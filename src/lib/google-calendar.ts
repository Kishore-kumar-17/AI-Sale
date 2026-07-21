import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
];

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getGoogleAuthUrl(state: string): string {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export async function exchangeCodeAndConnect(code: string, userId: string): Promise<void> {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google didn't return a refresh token. Disconnect (if already connected) and try connecting again."
    );
  }

  let email: string | null = null;
  if (tokens.access_token) {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (res.ok) {
      const info = await res.json();
      email = info.email ?? null;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      googleRefreshToken: tokens.refresh_token,
      googleAccessToken: tokens.access_token ?? null,
      googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      googleConnectedEmail: email,
    },
  });
}

export async function disconnectGoogle(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      googleRefreshToken: null,
      googleAccessToken: null,
      googleTokenExpiry: null,
      googleConnectedEmail: null,
    },
  });
}

function getCalendarClientForUser(user: {
  id: string;
  googleRefreshToken: string | null;
  googleAccessToken: string | null;
  googleTokenExpiry: Date | null;
}) {
  if (!user.googleRefreshToken) return null;

  const client = getOAuthClient();
  client.setCredentials({
    refresh_token: user.googleRefreshToken,
    access_token: user.googleAccessToken ?? undefined,
    expiry_date: user.googleTokenExpiry ? user.googleTokenExpiry.getTime() : undefined,
  });

  client.on("tokens", (tokens) => {
    if (!tokens.access_token) return;
    prisma.user
      .update({
        where: { id: user.id },
        data: {
          googleAccessToken: tokens.access_token,
          googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        },
      })
      .catch((err) => console.error("Failed to cache refreshed Google access token:", err));
  });

  return google.calendar({ version: "v3", auth: client });
}

export async function createCalendarEventForMeeting(params: {
  user: {
    id: string;
    googleRefreshToken: string | null;
    googleAccessToken: string | null;
    googleTokenExpiry: Date | null;
  };
  businessName: string;
  leadEmail: string | null;
  scheduledAt: Date;
  durationMinutes: number;
  meetingType: "ONLINE" | "OFFLINE";
  notes: string | null;
}): Promise<{ eventId: string | null; meetLink: string | null } | null> {
  const calendar = getCalendarClientForUser(params.user);
  if (!calendar) return null;

  const endTime = new Date(params.scheduledAt.getTime() + params.durationMinutes * 60_000);

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: params.meetingType === "ONLINE" ? 1 : 0,
    sendUpdates: params.leadEmail ? "all" : "none",
    requestBody: {
      summary: `Meeting with ${params.businessName}`,
      description: params.notes ?? undefined,
      start: { dateTime: params.scheduledAt.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees: params.leadEmail ? [{ email: params.leadEmail }] : undefined,
      ...(params.meetingType === "ONLINE"
        ? {
            conferenceData: {
              createRequest: { requestId: `${params.user.id}-${Date.now()}` },
            },
          }
        : {}),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  return {
    eventId: response.data.id ?? null,
    meetLink: response.data.hangoutLink ?? null,
  };
}
