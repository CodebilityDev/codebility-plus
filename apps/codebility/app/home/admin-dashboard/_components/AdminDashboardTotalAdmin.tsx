"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDashboardTotalAdminProps {
  count?: number;
  className?: string;
}

export default function AdminDashboardTotalAdmin({
  count,
  className,
}: AdminDashboardTotalAdminProps) {
  return (
    <Card className={cn("group transition-all hover:shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Total Admins
          </p>
        </div>
        <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500 transition-colors group-hover:bg-purple-500/20">
          <UserCog className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {count !== undefined ? count.toLocaleString() : "N/A"}
        </div>
        <p className="text-xs text-muted-foreground">
          System administrators
        </p>
      </CardContent>
    </Card>
  );
}
