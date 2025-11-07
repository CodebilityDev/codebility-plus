"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserX } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDashboardTotalInactiveInternProps {
  count?: number;
  className?: string;
}

export default function AdminDashboardTotalInactiveIntern({
  count,
  className,
}: AdminDashboardTotalInactiveInternProps) {
  return (
    <Card className={cn("group relative overflow-hidden transition-all hover:shadow-lg", className)}>
      {/* Gradient background - only visible in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/10 to-purple-950/10 dark:block hidden" />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Inactive Interns
          </p>
        </div>
        <div className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors group-hover:bg-red-500/20">
          <UserX className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold">
          {count !== undefined ? count.toLocaleString() : "N/A"}
        </div>
        <p className="text-xs text-muted-foreground">
          Currently inactive interns
        </p>
      </CardContent>
    </Card>
  );
}