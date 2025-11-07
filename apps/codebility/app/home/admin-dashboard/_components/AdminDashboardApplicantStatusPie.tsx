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
} from "@/components/ui/chart";
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
      <Card className="flex h-full flex-col relative overflow-hidden">
        {/* Gradient background - only visible in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/10 to-purple-950/10 dark:block hidden" />
        
        <CardHeader className="relative items-center pb-0">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );

  const chartData = Object.keys(data || {}).map((status) => ({
    status,
    applicants: data[status],
    fill: `var(--color-${status})`,
  }));

  const chartConfig = Object.keys(data || {}).reduce(
    (config, status) => {
      const capitalizedLabel = status.charAt(0).toUpperCase() + status.slice(1);
      config[status] = {
        label: capitalizedLabel,
        color: `hsl(var(--chart-${Object.keys(config).length + 1}))`,
      };
      return config;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  return (
    <Card className="flex h-full flex-col relative overflow-hidden">
      {/* Gradient background - only visible in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/10 to-purple-950/10 dark:block hidden" />
      
      <CardHeader className="relative items-center pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-center text-sm">
          Distribution of application statuses
        </CardDescription>
      </CardHeader>
      <CardContent className="relative flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <Pie 
              data={chartData} 
              dataKey="applicants" 
              strokeWidth={2}
            />
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