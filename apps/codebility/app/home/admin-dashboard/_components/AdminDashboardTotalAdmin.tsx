"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserCog } from "lucide-react";

interface AdminDashboardTotalAdminProps {
  count?: number;
}

export default function AdminDashboardTotalAdmin({
  count,
}: AdminDashboardTotalAdminProps) {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total Admins
        </p>
        <span>
          <UserCog />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {count !== undefined ? count : "N/A"}
        </div>
      </CardContent>
    </Card>
  );
}
