"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/Components/ui/chart";
import { Pie, PieChart } from "recharts";

const chartData = [
  { status: "accepted", applicants: 275, fill: "var(--color-accepted)" },
  { status: "pending", applicants: 200, fill: "var(--color-pending)" },
  { status: "denied", applicants: 187, fill: "var(--color-denied)" },
];

const chartConfig = {
  applicants: {
    label: "Applicants",
  },
  accepted: {
    label: "Accepted",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  denied: {
    label: "Denied",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function AdminDashboardApplicantStatusPie() {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Applicant Status</CardTitle>
        <CardDescription>All-time status data</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="applicants" />
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
