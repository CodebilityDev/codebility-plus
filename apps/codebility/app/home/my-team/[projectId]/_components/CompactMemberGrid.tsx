"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SimpleMemberData } from "@/app/home/projects/actions";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Mail, Calendar, Trophy, RefreshCw, AlertCircle } from "lucide-react";
import { multipleMoveApplicantToOnboardingAction } from "@/app/home/applicants/_service/action";
const ATTENDANCE_POINTS_PER_DAY = 2;
import { getTeamMonthlyAttendancePoints } from "../actions";
import MemberDetailModal from "../../_components/MemberDetailModal";

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

// Fix #4: Track per-member fetch errors separately from points data
interface MemberErrors {
  [codevId: string]: boolean;
}

const CompactMemberGrid = ({ members, teamLead, projectId }: CompactMemberGridProps) => {
  const allMembers = teamLead ? [teamLead, ...members] : members;
  const memberKey = allMembers.map((m) => m.id).join(",");
  const [memberPoints, setMemberPoints] = useState<MemberPoints>({});
  const [memberErrors, setMemberErrors] = useState<MemberErrors>({});
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [monthlyAttendancePoints, setMonthlyAttendancePoints] = useState<{ uniqueCodevIdsPresentDays: { codevId: string; presentDays: number }[]; }>({ uniqueCodevIdsPresentDays: [] });
  const [selectedMember, setSelectedMember] = useState<SimpleMemberData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const loadedMemberIdsRef = useRef<string>("");

  // Load points for all members - runs automatically on mount and can be refreshed
  const loadAllPoints = async () => {
    if (isLoadingPoints) return;

    setIsLoadingPoints(true);
    const pointsData: MemberPoints = {};
    const errorsData: MemberErrors = {};

    try {
      const batchSize = 3;
      for (let i = 0; i < allMembers.length; i += batchSize) {
        const batch = allMembers.slice(i, i + batchSize);
        const pointsPromises = batch.map(async (member) => {
          try {
            const response = await fetch(`/api/codev/${member.id}/points`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json() as { totalPoints?: number; attendancePoints?: number };
            return { memberId: member.id, data, failed: false };
          } catch (error) {
            // Fix #4: Record the failure instead of silently substituting 0
            console.warn(`Failed to load points for ${member.id}:`, error);
            return { memberId: member.id, data: null, failed: true };
          }
        });

        const results = await Promise.all(pointsPromises);

        results.forEach(({ memberId, data, failed }) => {
          if (failed || !data) {
            errorsData[memberId] = true;
          } else {
            pointsData[memberId] = {
              totalPoints: data.totalPoints || 0,
              attendancePoints: data.attendancePoints || 0,
            };
          }
        });

        setMemberPoints(prev => ({ ...prev, ...pointsData }));
        setMemberErrors(prev => ({ ...prev, ...errorsData }));
      }
    } catch (error) {
      console.error("Error loading points:", error);
    } finally {
      setIsLoadingPoints(false);
    }
  };

  // Retry a single member's points fetch
  const retryMemberPoints = async (memberId: string) => {
    setMemberErrors(prev => ({ ...prev, [memberId]: false }));
    try {
      const response = await fetch(`/api/codev/${memberId}/points`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json() as { totalPoints?: number; attendancePoints?: number };
      setMemberPoints(prev => ({
        ...prev,
        [memberId]: {
          totalPoints: data.totalPoints || 0,
          attendancePoints: data.attendancePoints || 0,
        },
      }));
    } catch (error) {
      console.warn(`Retry failed for ${memberId}:`, error);
      setMemberErrors(prev => ({ ...prev, [memberId]: true }));
    }
  };

  useEffect(() => {
    const loadAttendancePoints = async () => {
      const currentDate = new Date();
      const result = await getTeamMonthlyAttendancePoints(
        projectId,
        currentDate.getFullYear(),
        currentDate.getMonth()
      );

      if (result.success) {
        setMonthlyAttendancePoints({
          uniqueCodevIdsPresentDays: (result.uniqueCodevIdsPresentDays || []).map(item => ({
            codevId: item.codevId,
            presentDays: item.presentDays ?? 0
          }))
        });
      }
    };

    loadAttendancePoints();
  }, [projectId]);

  useEffect(() => {
    if (allMembers.length === 0) return;
    if (memberKey === loadedMemberIdsRef.current) return;
    loadedMemberIdsRef.current = memberKey;
    loadAllPoints();
  }, [memberKey]);

  const hasPointsData = Object.keys(memberPoints).length > 0 || Object.keys(memberErrors).length > 0;

  const handleMemberClick = (member: SimpleMemberData) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="space-y-4">
      {/* Refresh Points Button */}
      {hasPointsData && !isLoadingPoints && allMembers.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={loadAllPoints}
            className="px-3 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors flex items-center gap-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Refresh member points and stats"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Stats
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoadingPoints && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          Loading member statistics...
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allMembers.map((member) => {
          const isLead = teamLead?.id === member.id;
          const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";
          const memberHasPoints = memberPoints[member.id];
          const memberHasError = memberErrors[member.id];

          return (
            <div
              key={member.id}
              onClick={() => handleMemberClick(member)}
              className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 overflow-hidden cursor-pointer"
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
              {(memberHasPoints || memberHasError || hasPointsData) && (
                <div className="mt-3 border-t border-gray-100 pt-2 dark:border-gray-700">
                  {/* Fix #4: Show error state with retry instead of silent 0 */}
                  {memberHasError ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3 w-3" />
                        Stats unavailable
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          retryMemberPoints(member.id);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Retry
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          <span className="text-gray-500">Total Points:</span>
                          {memberHasPoints ? (
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {memberPoints[member.id]?.totalPoints || 0}
                            </span>
                          ) : (
                            <div className="w-8 h-3 bg-gray-200 animate-pulse rounded"></div>
                          )}
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
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span>This month: </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {monthlyAttendancePoints.uniqueCodevIdsPresentDays.find(
                            item => item.codevId === member.id
                          )?.presentDays || 0}d
                        </span>
                        <span>present</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Member Detail Modal */}
      <MemberDetailModal
        isOpen={isModalOpen}
        member={selectedMember}
        isTeamLead={selectedMember?.id === teamLead?.id}
        projectId={projectId}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CompactMemberGrid;