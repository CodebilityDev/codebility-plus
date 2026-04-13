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

interface ProjectCategoryCounts extends Record<string, number> {}

interface AdminDashboardProjectsPieProps {
  data?: ProjectCategoryCounts;
}

// Distinct colors per category slot — avoids the all-blue sameness from hsl(--chart-N)
const CATEGORY_COLORS = [
  "#06b6d4", // cyan       — Web Application
  "#3b82f6", // blue       — Mobile Application
  "#8b5cf6", // violet     — Product Design
  "#10b981", // emerald    — AI Development
  "#f59e0b", // amber      — CMS
  "#ec4899", // pink       — fallback 6th+
  "#f97316", // orange     — fallback 7th+
];

export default function AdminDashboardProjectsPie({
  data,
}: AdminDashboardProjectsPieProps) {
  const title = "Projects";

  const emptyCard = (
    <Card
      className={cn(
        "flex h-full flex-col relative overflow-hidden",
        "bg-white dark:bg-gradient-to-br dark:from-cyan-950 dark:via-slate-900 dark:to-slate-950",
        "border-gray-200 dark:border-cyan-900/30",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100 dark:from-cyan-500/10" />
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

  const formatKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_");

  const chartData = Object.entries(data).map(([key, value], index) => ({
    category: formatKey(key),
    label: key,
    projects: value,
    percentage: ((value / total) * 100).toFixed(1),
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const chartConfig = Object.entries(data).reduce((acc, [key], index) => {
    const formattedKey = formatKey(key);
    acc[formattedKey] = {
      label: key,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card
      className={cn(
        "flex h-full flex-col relative overflow-hidden",
        "bg-white dark:bg-gradient-to-br dark:from-cyan-950 dark:via-slate-900 dark:to-slate-950",
        "border-gray-200 dark:border-cyan-900/30",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100 dark:from-cyan-500/10" />

      <CardHeader className="relative items-center pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-center text-sm">
          Distribution by project categories
        </CardDescription>
      </CardHeader>

      <CardContent className="relative flex-1 pb-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            {/* Tooltip: shows category, project count, and percentage */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const entry = chartData.find((d) => d.category === name);
                    const percentage = entry?.percentage ?? "0";
                    return (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">{entry?.label ?? name}</span>
                        <span>
                          {value} {value === 1 ? "project" : "projects"} ({percentage}%)
                        </span>
                      </div>
                    );
                  }}
                  hideLabel
                />
              }
            />

            {/* Donut chart with SVG center label */}
            <Pie
              data={chartData}
              dataKey="projects"
              nameKey="category"
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
                    style={{
                      fontSize: "0.75rem",
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  >
                    Total
                  </text>
                </g>
              )}
            >
              {chartData.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>

            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap justify-center gap-2 [&>*]:whitespace-nowrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}