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
    <Card className="flex h-full flex-col relative overflow-hidden">
      {/* Gradient background - only visible in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/10 to-purple-950/10 dark:block hidden" />
      
      <CardHeader className="relative items-center pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-center text-sm">
          Distribution by project categories
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