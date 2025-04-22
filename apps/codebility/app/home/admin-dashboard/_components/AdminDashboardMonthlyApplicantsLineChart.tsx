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
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

const chartData = [
  { month: "October", applicants: 186 },
  { month: "November", applicants: 305 },
  { month: "December", applicants: 237 },
  { month: "January", applicants: 73 },
  { month: "February", applicants: 209 },
  { month: "March", applicants: 214 },
];

const chartConfig = {
  applicants: {
    label: "applicants",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const getSixMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const formatMonthYear = (date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" });

  return `${formatMonthYear(start)} - ${formatMonthYear(end)}`;
};

export default function AdminDashboardMonthlyApplicantsLineChart() {
  return (
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>Monthly Applicants</CardTitle>
        <CardDescription>{getSixMonthRange()}</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
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
          Showing monthly applicants for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
