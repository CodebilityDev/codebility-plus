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
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

interface AdminDashboardMonthlyApplicantsLineChartProp {
  dateApplied?: string[];
}

export default function AdminDashboardMonthlyApplicantsLineChart({
  dateApplied = [],
}: AdminDashboardMonthlyApplicantsLineChartProp) {
  // Get current and previous 5 months
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

  const chartConfig = {
    applicants: {
      label: "applicants",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="relative overflow-hidden">
      {/* Gradient background - only visible in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/10 to-purple-950/10 dark:block hidden" />
      
      <CardHeader className="relative">
        <CardTitle className="text-lg">Monthly Applicants</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                className="opacity-30"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                className="text-xs"
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="applicants"
                type="monotone"
                stroke="var(--color-applicants)"
                strokeWidth={3}
                dot={{ 
                  fill: "var(--color-applicants)", 
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: "var(--color-applicants)",
                  strokeWidth: 2 
                }}
              />
            </LineChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="relative flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing monthly applicants for the current and previous 5 months
        </div>
      </CardFooter>
    </Card>
  );
}