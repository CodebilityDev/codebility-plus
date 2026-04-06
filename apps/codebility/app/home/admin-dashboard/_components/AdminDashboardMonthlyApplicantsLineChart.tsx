"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface AdminDashboardMonthlyApplicantsLineChartProp {
  dateApplied?: string[];
}

export default function AdminDashboardMonthlyApplicantsLineChart({
  dateApplied = [],
}: AdminDashboardMonthlyApplicantsLineChartProp) {
  const getLastSixMonths = () => {
    const now = new Date();
    const months: { month: string; year: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
      });
    }

    return months;
  };

  const monthsData = getLastSixMonths();

  const chartData = monthsData.map(({ month, year }) => {
    const count = dateApplied.filter((dateStr) => {
      const d = new Date(dateStr);
      return (
        d.getMonth() === new Date(`${month} 1, ${year}`).getMonth() &&
        d.getFullYear() === year
      );
    }).length;

    return { month, year, applicants: count };
  });

  let description = "";
  if (chartData.length > 0) {
    const first = chartData[0]!;
    const last = chartData[chartData.length - 1]!;
    description = `${first.month} ${first.year} - ${last.month} ${last.year}`;
  }

  // Trend: compare last month vs the month before
  const lastMonth = chartData[chartData.length - 1]?.applicants ?? 0;
  const prevMonth = chartData[chartData.length - 2]?.applicants ?? 0;
  const trendDiff = lastMonth - prevMonth;
  const trendPercent =
    prevMonth > 0 ? Math.abs((trendDiff / prevMonth) * 100).toFixed(1) : null;

  const TrendIcon =
    trendDiff > 0 ? TrendingUp : trendDiff < 0 ? TrendingDown : Minus;
  const trendColor =
    trendDiff > 0
      ? "text-emerald-500"
      : trendDiff < 0
        ? "text-red-400"
        : "text-muted-foreground";
  const trendLabel =
    trendDiff > 0
      ? `Up ${trendPercent}% from last month`
      : trendDiff < 0
        ? `Down ${trendPercent}% from last month`
        : "No change from last month";

  // Y-axis: nice rounded max with some breathing room
  const maxApplicants = Math.max(...chartData.map((d) => d.applicants), 0);
  const yAxisMax = Math.ceil((maxApplicants * 1.2) / 10) * 10 || 10;

  const chartConfig = {
    applicants: {
      label: "Applicants",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "bg-white dark:bg-gradient-to-br dark:from-green-950 dark:via-slate-900 dark:to-slate-950",
        "border-gray-200 dark:border-green-900/30",
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none opacity-0 dark:opacity-100 dark:from-green-500/10" />

      <CardHeader className="relative">
        <CardTitle className="text-lg">Monthly Applicants</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="relative h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 8, right: 16, top: 12, bottom: 12 }}
            >
              {/* Gradient fill under the line */}
              <defs>
                <linearGradient id="applicantsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-applicants)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-applicants)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="opacity-30"
              />

              {/* Y-axis with applicant counts */}
              <YAxis
                domain={[0, yAxisMax]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
                width={36}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />

              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    formatter={(value, name, props) => (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">
                          {props.payload?.month}
                        </span>
                        <span>
                          {value} applicant{value !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    hideLabel
                  />
                }
              />

              <Area
                dataKey="applicants"
                type="monotone"
                stroke="var(--color-applicants)"
                strokeWidth={3}
                fill="url(#applicantsGradient)"
                dot={{
                  fill: "var(--color-applicants)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: "var(--color-applicants)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="relative flex-col items-start gap-1.5 text-sm">
        {/* Trend indicator */}
        <div className={cn("flex items-center gap-1.5 font-medium", trendColor)}>
          <TrendIcon className="h-4 w-4" />
          <span>{trendLabel}</span>
        </div>
        <div className="leading-none text-muted-foreground">
          Showing monthly applicants for the current and previous 5 months
        </div>
      </CardFooter>
    </Card>
  );
}