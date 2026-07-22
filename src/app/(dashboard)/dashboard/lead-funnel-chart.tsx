"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LeadFunnelChart({ data }: { data: { label: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
