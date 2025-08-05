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

interface ProjectCategoryCounts extends Record<string, number> {}

interface AdminDashboardProjectsPieProps {
  data?: ProjectCategoryCounts;
}

export default function AdminDashboardProjectsPie({
  data,
}: AdminDashboardProjectsPieProps) {
  const title = "Projects";
  if (!data)
    return (
      <Card className="flex h-full flex-col bg-black">
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      </Card>
    );

  const formatKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_");

  const chartData = Object.entries(data).map(([key, value]) => {
    const formattedKey = formatKey(key);

    return {
      category: formattedKey,
      projects: value,
      fill: `var(--color-${formattedKey})`,
    };
  });

  const chartConfig = Object.keys(data).reduce((acc, key, index) => {
    const formattedKey = formatKey(key);

    acc[formattedKey] = {
      label: key,
      color: `hsl(var(--chart-${index + 1}))`,
    };

    return acc;
  }, {} as ChartConfig);

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
            <Pie data={chartData} dataKey="projects" />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
