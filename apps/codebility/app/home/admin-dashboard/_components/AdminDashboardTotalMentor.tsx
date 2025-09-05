"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPen } from "lucide-react";

interface AdminDashboardTotalMentorProps {
  count?: number;
}

export default function AdminDashboardTotalMentor({
  count,
}: AdminDashboardTotalMentorProps) {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total Mentors
        </p>
        <span>
          <UserPen />
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
