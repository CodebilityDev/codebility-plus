"use client";

import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Server } from "lucide-react";

interface AdminDashboardTotalProjectsProps {
  count?: number;
}

export default function AdminDashboardTotalProject({
  count,
}: AdminDashboardTotalProjectsProps) {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total Projects
        </p>
        <span>
          <Server />
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
