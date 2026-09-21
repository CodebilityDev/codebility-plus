"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAttendanceWarningStatus } from "@/actions/my-team/attendance-warnings";

interface AttendanceWarningBannerProps {
  projectId: string;
  isTeamLead: boolean;
}

export default function AttendanceWarningBanner({ projectId, isTeamLead }: AttendanceWarningBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // The month is part of the key: it changes which absences are counted, so a
  // key without it would serve last month's warnings.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const { data: warningData } = useQuery({
    queryKey: ["myTeam", "attendanceWarnings", projectId, year, month],
    enabled: isTeamLead,
    staleTime: 60_000,
    queryFn: async () => {
      const result = await getAttendanceWarningStatus(projectId, year, month);
      if (!result.success || (result.summary?.membersWithWarnings ?? 0) === 0) {
        return null;
      }
      return result;
    },
  });

  if (!isTeamLead || !warningData || !isVisible) {
    return null;
  }

  const { summary, data } = warningData as { summary: any; data: any[] };
  const membersWithWarnings = data.filter((m: any) => m.hasWarning);

  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                Attendance Warning: {summary.membersWithWarnings} member{summary.membersWithWarnings > 1 ? 's' : ''} at risk
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                The following members have 3 or more absences this month:
              </p>
            </div>
            
            <div className="space-y-1">
              {membersWithWarnings.map((member: any) => (
                <div key={member.codevId} className="text-sm">
                  <span className="font-medium text-red-800 dark:text-red-200">
                    {member.name}
                  </span>
                  <span className="text-red-600 dark:text-red-400 ml-2">
                    - {member.absences} absences ({member.attendancePercentage}% attendance)
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Members with 3+ absences have been notified about potential account deactivation. 
              Please follow up with them to understand any issues.
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}