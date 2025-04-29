"use client";

import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { UserX } from "lucide-react";

interface AdminDashboardTotalInactiveInternProps {
  count?: number;
}

export default function AdminDashboardTotalInactiveIntern({
  count,
}: AdminDashboardTotalInactiveInternProps) {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total Inactive Interns
        </p>
        <span>
          <UserX />
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
