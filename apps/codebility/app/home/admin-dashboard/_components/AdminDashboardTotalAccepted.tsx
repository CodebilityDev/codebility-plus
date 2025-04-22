"use client";

import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { UserCheck } from "lucide-react";

const totalAcceptedApplicants = 200;

export default function AdminDashboardTotalAccepted() {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total Accepted Applicants
        </p>
        <span>
          <UserCheck />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalAcceptedApplicants}</div>
        <p className="text-xs text-muted-foreground">
          Total accepted applicants to date
        </p>
      </CardContent>
    </Card>
  );
}
