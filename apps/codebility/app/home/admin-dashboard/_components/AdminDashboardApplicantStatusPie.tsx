"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Cell, Pie, PieChart } from "recharts";

interface ApplicantStatusCounts extends Record<string, number> {}

interface AdminDashboardApplicantStatusPieProps {
  data?: ApplicantStatusCounts;
}

// Distinct, accessible colors per status — avoids the all-blue sameness
const STATUS_COLORS: Record<string, string> = {
  applying: "#3b82f6",   // blue
  testing: "#f59e0b",    // amber
  onboarding: "#10b981", // emerald
  passed: "#8b5cf6",     // violet
};

// Fallback for any unexpected statuses
const FALLBACK_COLORS = ["#ec4899", "#14b8a6", "#f97316", "#6366f1"];

export default function AdminDashboardApplicantStatusPie({
  data,
}: AdminDashboardApplicantStatusPieProps) {
  const title = "Total Applicant Status";

  const emptyCard = (
    <Card
      className={cn(
        "flex h-full flex-col relative overflow-hidden",
        "bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:via-slate-900 dark:to-slate-950",
        "border-gray-200 dark:border-blue-900/30",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100 dark:from-blue-500/10" />
      <CardHeader className="relative items-center pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </CardContent>
    </Card>
  );

  if (!data) return emptyCard;

  const total = Object.values(data).reduce((sum, v) => sum + v, 0);

  if (total === 0) return emptyCard;

  const chartData = Object.keys(data).map((status, index) => ({
    status,
    applicants: data[status],
    percentage: total > 0 ? (((data[status] ?? 0) / total) * 100).toFixed(1) : "0",
    fill: STATUS_COLORS[status] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  }));

  const chartConfig = Object.keys(data).reduce(
    (config, status, index) => {
      config[status] = {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        color: STATUS_COLORS[status] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
      };
      return config;
    },
    {} as ChartConfig,
  );

  return (
    <Card
      className={cn(
        "flex h-full flex-col relative overflow-hidden",
        "bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:via-slate-900 dark:to-slate-950",
        "border-gray-200 dark:border-blue-900/30",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100 dark:from-blue-500/10" />

      <CardHeader className="relative items-center pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-center text-sm">
          Distribution of application statuses
        </CardDescription>
      </CardHeader>

      <CardContent className="relative flex-1 pb-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            {/* Tooltip: shows status label, count, and percentage */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const entry = chartData.find((d) => d.status === name);
                    const percentage = entry?.percentage ?? "0";
                    return (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold capitalize">{name}</span>
                        <span>
                          {value} applicants ({percentage}%)
                        </span>
                      </div>
                    );
                  }}
                  hideLabel
                />
              }
            />

            {/* Donut chart — inner radius reveals the total count in the center */}
            <Pie
              data={chartData}
              dataKey="applicants"
              nameKey="status"
              innerRadius="50%"
              outerRadius="75%"
              strokeWidth={3}
              stroke="transparent"
              paddingAngle={3}
              labelLine={false}
              label={({ cx, cy }) => (
                <g>
                  <text
                    x={cx}
                    y={cy - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground"
                    style={{ fontSize: "1.5rem", fontWeight: 700 }}
                  >
                    {total.toLocaleString()}
                  </text>
                  <text
                    x={cx}
                    y={cy + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "0.75rem", fill: "hsl(var(--muted-foreground))" }}
                  >
                    Total
                  </text>
                </g>
              )}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>

            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>

      </CardContent>
    </Card>
  );
}