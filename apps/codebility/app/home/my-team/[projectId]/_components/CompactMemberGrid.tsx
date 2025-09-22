"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SimpleMemberData } from "@/app/home/projects/actions";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Mail, Phone, Calendar, MapPin, Briefcase, Trophy } from "lucide-react";
import { multipleMoveApplicantToOnboardingAction } from "@/app/home/applicants/_service/action";
const ATTENDANCE_POINTS_PER_DAY = 2;
import { getTeamMonthlyAttendancePoints } from "../actions";

interface CompactMemberGridProps {
  members: SimpleMemberData[];
  teamLead: SimpleMemberData | null;
  projectId: string;
}

interface MemberPoints {
  [codevId: string]: {
    totalPoints: number;
    attendancePoints: number;
  };
}

const CompactMemberGrid = ({ members, teamLead, projectId }: CompactMemberGridProps) => {
  const allMembers = teamLead ? [teamLead, ...members] : members;
  const [memberPoints, setMemberPoints] = useState<MemberPoints>({});
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);
  const [monthlyAttendancePoints, setMonthlyAttendancePoints] = useState<{ uniqueCodevIdsPresentDays: { codevId: string; presentDays: number }[]; }>({ uniqueCodevIdsPresentDays: [] });

  // Load points for all members
  useEffect(() => {
    const loadAllPoints = async () => {
      setIsLoadingPoints(true);
      const pointsData: MemberPoints = {};

      try {
        const pointsPromises = allMembers.map(async (member) => {
          const response = await fetch(`/api/codev/${member.id}/points`);
          const data = await response.json();
          return { memberId: member.id, data };
        });

        const results = await Promise.all(pointsPromises);

        results.forEach(({ memberId, data }) => {
          pointsData[memberId] = {
            totalPoints: data.totalPoints || 0,
            attendancePoints: data.attendancePoints || 0
          };
        });

        setMemberPoints(pointsData);
      } catch (error) {
        console.error("Error loading points:", error);
      } finally {
        setIsLoadingPoints(false);
      }
    };

    if (allMembers.length > 0) {
      loadAllPoints();
    }
  }, [allMembers.length]);

  useEffect(() => {
    const loadAttendancePoints = async () => {
      const currentDate = new Date();
      const result = await getTeamMonthlyAttendancePoints(
        projectId,
        currentDate.getFullYear(),
        currentDate.getMonth()
      );

      if (result.success) {
        // console.log("Monthly attendance points:", result);
        setMonthlyAttendancePoints({
          uniqueCodevIdsPresentDays: result.uniqueCodevIdsPresentDays || []
        });
      }
    };

    loadAttendancePoints();
  }, [projectId]);



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {allMembers.map((member) => {
        const isLead = teamLead?.id === member.id;
        const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";

        return (
          <div
            key={member.id}
            className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 overflow-hidden"
          >
            {/* Status indicator */}
            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500" title="Active" />

            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {member.image_url ? (
                  <Image
                    src={imageUrl}
                    alt={`${member.first_name} ${member.last_name}`}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <DefaultAvatar size={48} />
                )}
                {isLead && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 px-1.5 py-0.5">
                    <span className="text-xs font-bold text-white">TL</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                  {member.first_name} {member.last_name}


                </h4>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {member.display_position || "Team Member"}
                </p>

                {/* Quick stats */}
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    {new Date(member.joined_at).getFullYear()}
                  </span>
                  <span className="flex items-center gap-1 min-w-0">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{member.email_address.split('@')[0]}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Points and Attendance summary */}
            <div className="mt-3 border-t border-gray-100 pt-2 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  <span className="text-gray-500">Total Points:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {memberPoints[member.id]?.totalPoints || 0}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-gray-500">Attendance:</span>
                  <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                    +{(() => {
                      const found = monthlyAttendancePoints.uniqueCodevIdsPresentDays.find(
                        item => item.codevId === member.id
                      );
                      return found ? found.presentDays * ATTENDANCE_POINTS_PER_DAY : 0;
                    })()}
                  </span>
                </div>
              </div>
              {!isLoadingPoints && (
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span>This month: </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {monthlyAttendancePoints.uniqueCodevIdsPresentDays.find(
                      item => item.codevId === member.id
                    )?.presentDays || 0}d
                  </span>
                  <span>present</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompactMemberGrid;