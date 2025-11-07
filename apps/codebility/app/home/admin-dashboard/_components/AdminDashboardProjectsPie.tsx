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
import { cn } from "@/lib/utils";

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
      <Card 
        className={cn(
          "flex h-full flex-col",
          // Light mode - clean white
          "bg-white border-gray-200",
          // Dark mode - Home's bronze gradient
          "dark:bg-gradient-to-r dark:from-[#563c1e] dark:to-[#ba8240]"
        )}
      >
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg dark:text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground dark:text-white/70">No data available</p>
        </CardContent>
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
    <Card 
      className={cn(
        "flex h-full flex-col",
        // Light mode - clean white
        "bg-white border-gray-200",
        // Dark mode - Home's bronze gradient
        "dark:bg-gradient-to-r dark:from-[#563c1e] dark:to-[#ba8240]"
      )}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg dark:text-white">{title}</CardTitle>
        <CardDescription className="text-center text-sm dark:text-white/70">
          Distribution by project categories
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <Pie 
              data={chartData} 
              dataKey="projects" 
              strokeWidth={2}
            />
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