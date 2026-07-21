import { UserProfile } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { disconnectGoogleAction } from "./google-actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { userId: clerkId } = await auth();
  const user = clerkId ? await prisma.user.findUnique({ where: { clerkId } }) : null;
  const connected = !!user?.googleRefreshToken;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and profile.
        </p>
      </div>

      {typeof params.google_connected === "string" && (
        <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600">
          Google Calendar connected.
        </p>
      )}
      {typeof params.google_error === "string" && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Couldn&apos;t connect Google Calendar ({params.google_error}). Please try again.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
          <CardDescription>
            {connected
              ? `Connected as ${user?.googleConnectedEmail ?? "unknown account"}. Meetings you schedule will automatically create Google Calendar events with reminders.`
              : "Connect your Google Calendar so meetings you schedule automatically create calendar events with reminders."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connected ? (
            <form action={disconnectGoogleAction}>
              <Button type="submit" variant="outline">
                Disconnect
              </Button>
            </form>
          ) : (
            <Button render={<a href="/api/google/connect" />}>Connect Google Calendar</Button>
          )}
        </CardContent>
      </Card>

      <UserProfile
        routing="hash"
        appearance={{ elements: { rootBox: "w-full", cardBox: "w-full shadow-none" } }}
      />
    </div>
  );
}
