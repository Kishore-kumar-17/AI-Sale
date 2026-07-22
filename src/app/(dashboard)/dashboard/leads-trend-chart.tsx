"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LeadsTrendChart({ data }: { data: { date: string; count: number }[] }) {
  const formatted = data.map((d) => ({
    ...d,
    // `d.date` is a UTC day bucket ("YYYY-MM-DD"); force UTC here too, otherwise the
    // browser's local timezone can shift the displayed label by a day.
    label: new Date(d.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={formatted} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            fontSize: 12,
          }}
        />
        <Line type="monotone" dataKey="count" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
