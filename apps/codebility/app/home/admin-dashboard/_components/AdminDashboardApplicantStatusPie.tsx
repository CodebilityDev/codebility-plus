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

interface ApplicantStatusCounts extends Record<string, number> {}

interface AdminDashboardApplicantStatusPieProps {
  data?: ApplicantStatusCounts;
}

export default function AdminDashboardApplicantStatusPie({
  data,
}: AdminDashboardApplicantStatusPieProps) {
  const title = "Total Applicant Status";
  if (!data)
    return (
      <Card className="flex h-full flex-col bg-black">
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      </Card>
    );

  const chartData = Object.keys(data || {}).map((status) => ({
    status,
    applicants: data[status],
    fill: `var(--color-${status})`, // Assuming your color variable names match the status
  }));

  const chartConfig = Object.keys(data || {}).reduce(
    (config, status) => {
      const capitalizedLabel = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize the first letter
      config[status] = {
        label: capitalizedLabel,
        color: `hsl(var(--chart-${Object.keys(config).length + 1}))`, // Generate color based on index
      };
      return config;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>All-time status data</CardDescription> */}
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
