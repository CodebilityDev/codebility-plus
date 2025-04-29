"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart";
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
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>Monthly Applicants</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="applicants"
                type="natural"
                stroke="var(--color-applicants)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing monthly applicants for the current and previous 5 months
        </div>
      </CardFooter>
    </Card>
  );
}
