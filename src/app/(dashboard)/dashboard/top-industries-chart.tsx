"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PieLabelRenderProps } from "recharts";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function TopIndustriesChart({ data }: { data: { category: string; count: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        No categorized leads yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(props: PieLabelRenderProps) => {
            const entry = props as PieLabelRenderProps & { category?: string; count?: number };
            return `${entry.category} (${entry.count})`;
          }}
        >
          {data.map((entry, i) => (
            <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
