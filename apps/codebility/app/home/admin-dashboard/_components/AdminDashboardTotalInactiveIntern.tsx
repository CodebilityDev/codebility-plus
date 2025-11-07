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
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg",
        // Dark mode gradient background - red theme
        "bg-gradient-to-br from-red-950/40 via-slate-900/60 to-slate-950/40",
        "dark:from-red-950/30 dark:via-slate-900/50 dark:to-slate-950/30",
        // Border for definition
        "border border-red-900/20 dark:border-red-800/20",
        className
      )}
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
      
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