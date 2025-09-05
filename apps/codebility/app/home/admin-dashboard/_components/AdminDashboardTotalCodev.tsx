"use client";

import React, { memo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface AdminDashboardTotalCodevProps {
  count?: number;
}

const AdminDashboardTotalCodev = memo(({
  count,
}: AdminDashboardTotalCodevProps) => {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total Codevs
        </p>
        <span>
          <UserPlus />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {count !== undefined ? count : "N/A"}
        </div>
      </CardContent>
    </Card>
  );
});

AdminDashboardTotalCodev.displayName = "AdminDashboardTotalCodev";

export default AdminDashboardTotalCodev;
