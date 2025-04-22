"use client";

import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Users } from "lucide-react";

const totalApplicants = 400;

export default function AdminDashboardTotalApplicants() {
  return (
    <Card className="flex h-full flex-col bg-black">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          Total Applicants
        </p>
        <span>
          <Users />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalApplicants}</div>
        <p className="text-xs text-muted-foreground">
          Total applicants to date
        </p>
      </CardContent>
    </Card>
  );
}
