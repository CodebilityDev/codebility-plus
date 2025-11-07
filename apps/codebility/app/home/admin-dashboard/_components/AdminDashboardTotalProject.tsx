"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDashboardTotalProjectsProps {
  count?: number;
  className?: string;
}

export default function AdminDashboardTotalProject({
  count,
  className,
}: AdminDashboardTotalProjectsProps) {
  return (
    <Card className={cn("group relative overflow-hidden transition-all hover:shadow-lg", className)}>
      {/* Gradient background - only visible in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/10 to-purple-950/10 dark:block hidden" />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Projects
          </p>
        </div>
        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500 transition-colors group-hover:bg-cyan-500/20">
          <FolderKanban className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold">
          {count !== undefined ? count.toLocaleString() : "N/A"}
        </div>
        <p className="text-xs text-muted-foreground">
          Active projects
        </p>
      </CardContent>
    </Card>
  );
}