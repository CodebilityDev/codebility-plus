"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPen } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDashboardTotalMentorProps {
  count?: number;
  className?: string;
}

export default function AdminDashboardTotalMentor({
  count,
  className,
}: AdminDashboardTotalMentorProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg",
        // Dark mode gradient background - orange theme
        "bg-gradient-to-br from-orange-950/40 via-slate-900/60 to-slate-950/40",
        "dark:from-orange-950/30 dark:via-slate-900/50 dark:to-slate-950/30",
        // Border for definition
        "border border-orange-900/20 dark:border-orange-800/20",
        className
      )}
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Mentors
          </p>
        </div>
        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500 transition-colors group-hover:bg-orange-500/20">
          <UserPen className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold">
          {count !== undefined ? count.toLocaleString() : "N/A"}
        </div>
        <p className="text-xs text-muted-foreground">
          Active mentors
        </p>
      </CardContent>
    </Card>
  );
}