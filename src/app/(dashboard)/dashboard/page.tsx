import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getDashboardStats,
  getTopIndustries,
  getTopPerformer,
  getLeadFunnel,
  getLeadsTrend,
  getUpcomingMeetings,
} from "@/services/dashboard";
import { getRecentActivity } from "@/services/activity";
import { getIncompleteTasks } from "@/services/tasks";
import { LeadFunnelChart } from "./lead-funnel-chart";
import { TopIndustriesChart } from "./top-industries-chart";
import { LeadsTrendChart } from "./leads-trend-chart";

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default async function DashboardPage() {
  const [
    user,
    stats,
    topIndustries,
    topPerformer,
    funnel,
    trend,
    upcomingMeetings,
    recentActivity,
    pendingFollowups,
  ] = await Promise.all([
    currentUser(),
    getDashboardStats(),
    getTopIndustries(),
    getTopPerformer(),
    getLeadFunnel(),
    getLeadsTrend(),
    getUpcomingMeetings(),
    getRecentActivity(),
    getIncompleteTasks(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-muted-foreground">Your sales pipeline overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader>
            <CardDescription>Total Leads</CardDescription>
            <CardTitle className="text-3xl">{stats.totalLeads}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Today&apos;s Leads</CardDescription>
            <CardTitle className="text-3xl">{stats.todayLeads}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Meetings</CardDescription>
            <CardTitle className="text-3xl">{stats.totalMeetings}</CardTitle>
            <CardDescription>{stats.upcomingMeetings} upcoming</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Revenue (Won)</CardDescription>
            <CardTitle className="text-3xl">{formatInr(stats.revenue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-3xl">{stats.conversionRate}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Top Performer</CardDescription>
            <CardTitle className="text-xl">{topPerformer?.name ?? "—"}</CardTitle>
            {topPerformer && (
              <CardDescription>
                {topPerformer.wonCount} won · {formatInr(topPerformer.revenue)}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lead Funnel</CardTitle>
            <CardDescription>Leads by pipeline status</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadFunnelChart data={funnel} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Industries</CardTitle>
            <CardDescription>By lead category</CardDescription>
          </CardHeader>
          <CardContent>
            <TopIndustriesChart data={topIndustries} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads Trend</CardTitle>
          <CardDescription>New leads over the last 14 days</CardDescription>
        </CardHeader>
        <CardContent>
          <LeadsTrendChart data={trend} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
            {recentActivity.map((activity) => (
              <div key={activity.id} className="text-sm">
                <p>{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.createdAt.toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcomingMeetings.length === 0 && (
              <p className="text-sm text-muted-foreground">No upcoming meetings.</p>
            )}
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="text-sm">
                <Link href={`/leads/${meeting.leadId}`} className="font-medium hover:underline">
                  {meeting.lead.businessName}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {meeting.scheduledAt.toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Follow-ups</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pendingFollowups.length === 0 && (
              <p className="text-sm text-muted-foreground">No pending follow-ups.</p>
            )}
            {pendingFollowups.slice(0, 5).map((task) => (
              <div key={task.id} className="text-sm">
                <Link href={`/leads/${task.leadId}`} className="font-medium hover:underline">
                  {task.title}
                </Link>
                <p className="text-xs text-muted-foreground">Due {task.dueDate.toLocaleDateString()}</p>
              </div>
            ))}
            {pendingFollowups.length > 5 && (
              <Link href="/tasks" className="text-xs text-primary hover:underline">
                View all {pendingFollowups.length} →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
