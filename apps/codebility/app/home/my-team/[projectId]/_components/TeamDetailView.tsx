"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMembers,
  getTeamLead,
  SimpleMemberData,
  updateProjectMembers,
} from "@/app/home/projects/actions";
import { Button } from "@/components/ui/button";
import { Codev } from "@/types/home/codev";
import {
  Calendar,
  CalendarDays,
  CheckSquare,
  Clock,
  Kanban,
  Save,
  Table,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";

import ChecklistManageModal from "../../_components/ChecklistManageModal";
import AddMembersModal from "../../AddMembersModal";
import { getMeetingSchedule, getTeamMonthlyAttendancePoints } from "../actions";
import AttendanceGrid from "./AttendanceGrid";
import AttendanceWarningBanner from "./AttendanceWarningBanner";
import ChecklistStatusBanner from "./ChecklistStatusBanner";
import CompactMemberGrid from "./CompactMemberGrid";
import MeetingBasedAttendance from "./MeetingBasedAttendance";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import SyncAllAttendance from "./SyncAllAttendance";

/**
 * TeamDetailView - ENHANCED VERSION
 *
 * VISIBILITY RULES:
 * ✅ Team View tab: Always visible to everyone
 * ✅ Attendance tab: VISIBLE to everyone, EDITABLE only for team leads
 * ✅ Checklist button: Only visible to team leads
 * ✅ Schedule Meeting button: Only visible to team leads
 * ✅ Manage Members button: Only visible to team leads (in Team View)
 *
 * BEHAVIOR:
 * - Regular members: Can view attendance but cannot edit
 * - Team leads: Full edit access to attendance
 * - Regular members: See only Team View tab (read-only)
 * - Team leads: Full control over all team management features
 */

interface ProjectData {
  project: {
    id: string;
    name: string;
  };
  teamLead: {
    data: SimpleMemberData | null;
  };
  members: {
    data: SimpleMemberData[] | null;
  };
  currentUserId: string;
}

interface TeamDetailViewProps {
  projectData: ProjectData;
}

const TeamDetailView = ({ projectData }: TeamDetailViewProps) => {
  const router = useRouter();
  const [project, setProject] = useState(projectData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [viewMode, setViewMode] = useState<"team" | "attendance">("team");
  const [hasAttendanceChanges, setHasAttendanceChanges] = useState(false);
  const [useMeetingBasedAttendance, setUseMeetingBasedAttendance] =
    useState(true);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] =
    useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<{
    selectedDays: string[];
    time: string;
  } | null>(null);
  const [monthlyAttendancePoints, setMonthlyAttendancePoints] = useState<{
    totalPoints: number;
    presentDays: number;
  }>({ totalPoints: 0, presentDays: 0 });
  const attendanceGridRef = useRef<any>(null);

  const { project: projectInfo, teamLead, members, currentUserId } = project;
  const totalMembers = (members?.data?.length || 0) + (teamLead?.data ? 1 : 0);

  // ✅ Determine if current user is team lead
  const isCurrentUserTeamLead = teamLead?.data?.id
    ? currentUserId === teamLead.data.id
    : false;

  // Load meeting schedule on component mount
  useEffect(() => {
    const loadSchedule = async () => {
      const result = await getMeetingSchedule(projectInfo.id);
      if (result.success && result.schedule) {
        setCurrentSchedule(result.schedule);
      }
    };
    loadSchedule();
  }, [projectInfo.id]);

  // Load monthly attendance points only when needed
  useEffect(() => {
    const loadAttendancePoints = async () => {
      const currentDate = new Date();
      const result = await getTeamMonthlyAttendancePoints(
        projectInfo.id,
        currentDate.getFullYear(),
        currentDate.getMonth(),
      );

      if (result.success) {
        setMonthlyAttendancePoints({
          totalPoints: result.totalPoints,
          presentDays: result.presentDays,
        });
      }
    };

    if (viewMode === "team") {
      loadAttendancePoints();
    }
  }, [projectInfo.id, viewMode]);

  // Format schedule for display
  const formatSchedule = () => {
    if (
      !currentSchedule ||
      !currentSchedule.selectedDays ||
      currentSchedule.selectedDays.length === 0
    )
      return null;

    const weekDays = [
      { value: "monday", label: "Monday", short: "Mon" },
      { value: "tuesday", label: "Tuesday", short: "Tue" },
      { value: "wednesday", label: "Wednesday", short: "Wed" },
      { value: "thursday", label: "Thursday", short: "Thu" },
      { value: "friday", label: "Friday", short: "Fri" },
      { value: "saturday", label: "Saturday", short: "Sat" },
      { value: "sunday", label: "Sunday", short: "Sun" },
    ];

    const selectedDaysDisplay = currentSchedule.selectedDays
      .map((day) => weekDays.find((d) => d.value === day)?.short)
      .filter(Boolean)
      .join(", ");

    // Convert military time to 12-hour format
    const convertTo12Hour = (time24: string) => {
      const parts = time24.split(":");
      const hours = parts[0] || "0";
      const minutes = parts[1] || "00";
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight
      return `${hour12}:${minutes} ${ampm}`;
    };

    const formattedTime = convertTo12Hour(currentSchedule.time);

    return `${selectedDaysDisplay} at ${formattedTime} @ Discord`;
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleOpenChecklistModal = () => {
    setShowChecklistModal(true);
  };

  const handleCloseChecklistModal = () => {
    setShowChecklistModal(false);
  };

  const handleSaveAttendance = useCallback(async () => {
    if (attendanceGridRef.current?.saveAllAttendance) {
      await attendanceGridRef.current.saveAllAttendance();

      const currentDate = new Date();
      const result = await getTeamMonthlyAttendancePoints(
        projectInfo.id,
        currentDate.getFullYear(),
        currentDate.getMonth(),
      );

      if (result.success) {
        setMonthlyAttendancePoints({
          totalPoints: result.totalPoints,
          presentDays: result.presentDays,
        });
      }
    }
  }, [projectInfo.id]);

  const handleUpdateMembers = async (selectedMembers: Codev[]) => {
    try {
      setIsLoadingMembers(true);

      const teamLeadResult = await getTeamLead(projectInfo.id);
      const teamLead = teamLeadResult.data;

      if (!teamLead || !teamLead.id) {
        throw new Error("Team leader not found");
      }

      const updatedMembers = [
        {
          ...teamLead,
          positions: [],
          tech_stacks: [],
          display_position: teamLead.display_position ?? undefined,
        },
        ...selectedMembers
          .filter((member) => member.id !== teamLead.id)
          .map((member) => ({
            ...member,
            display_position: member.display_position ?? undefined,
          })),
      ];

      const result = await updateProjectMembers(
        projectInfo.id,
        updatedMembers,
        teamLead.id,
      );

      if (result.success) {
        toast.success("Project members updated successfully.");

        // ✅ FIXED: Re-fetch members to get accurate joined_at dates from database
        const updatedMembersResult = await getMembers(projectInfo.id);

        if (updatedMembersResult.data) {
          setProject((prev) => ({
            ...prev,
            members: { data: updatedMembersResult.data },
          }));
        }

        handleCloseModal();
      } else {
        toast.error(result.error || "Failed to update project members.");
      }
    } catch (error) {
      console.error("Failed to update members:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleScheduleUpdate = async () => {
    setShowScheduleMeetingModal(false);

    setTimeout(async () => {
      const result = await getMeetingSchedule(projectInfo.id);
      if (result.success && result.schedule) {
        setCurrentSchedule(result.schedule);
      }
    }, 500);
  };

  return (
    <>
      <div className="mb-10 space-y-6">
        {/* Attendance Warning Banner - Only shown for team leads in attendance view */}
        {viewMode === "attendance" && isCurrentUserTeamLead && (
          <AttendanceWarningBanner
            projectId={projectInfo.id}
            isTeamLead={isCurrentUserTeamLead}
          />
        )}

        {/* Header with Tab Buttons */}
        <div className="flex flex-col gap-3">
          {/* TOP ROW: View Mode Tabs + Checklist Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Team View Tab - Always visible */}
            <Button
              variant={viewMode === "team" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("team")}
              className={`flex h-9 items-center gap-1.5 px-2.5 text-xs sm:px-3 sm:text-sm ${
                viewMode !== "team"
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  : ""
              }`}
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="xs:inline hidden sm:inline">Team View</span>
              <span className="xs:hidden inline sm:hidden">Team</span>
            </Button>

            {/* Attendance Tab - VISIBLE TO ALL, READ-ONLY FOR NON-LEADS */}
            <Button
              variant={viewMode === "attendance" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("attendance")}
              className={`flex h-9 items-center gap-1.5 px-2.5 text-xs sm:px-3 sm:text-sm ${
                viewMode !== "attendance"
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  : ""
              }`}
            >
              <Table className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Attendance</span>
              {!isCurrentUserTeamLead}
            </Button>

            {/* Checklist Button - ONLY VISIBLE TO TEAM LEADS */}
            {isCurrentUserTeamLead && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenChecklistModal}
                className="flex h-9 items-center gap-1.5 border-purple-300 px-2.5 text-xs text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20 sm:px-3 sm:text-sm"
              >
                <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">Checklist</span>
              </Button>
            )}
          </div>

          {/* BOTTOM ROW: Action Buttons - Only shown when needed */}
          {((viewMode === "attendance" && isCurrentUserTeamLead) ||
            (viewMode === "team" && isCurrentUserTeamLead) ||
            true) && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Save & Sync buttons - Only for team leads in attendance view */}
              {viewMode === "attendance" &&
                isCurrentUserTeamLead &&
                hasAttendanceChanges && (
                  <Button
                    onClick={handleSaveAttendance}
                    variant="default"
                    size="sm"
                    className="flex h-9 items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                )}

              {/* Sync All Points, Schedule Meeting, Kanban Board in One row */}
              <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                {viewMode === "attendance" && isCurrentUserTeamLead && (
                  <SyncAllAttendance
                    projectId={projectInfo.id}
                    isTeamLead={isCurrentUserTeamLead}
                  />
                )}

                {/* Schedule Meeting - ONLY VISIBLE TO TEAM LEADS */}
                {isCurrentUserTeamLead && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex h-9 items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    title="Schedule Meetings"
                    onClick={() => setShowScheduleMeetingModal(true)}
                  >
                    <CalendarDays className="h-4 w-4" />
                    Schedule Meeting
                  </Button>
                )}

                {/* Kanban Board Button - VISIBLE TO ALL MEMBERS */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-9 items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
                  title="Go to Kanban Board"
                  onClick={() => router.push(`/home/kanban/${projectInfo.id}`)}
                >
                  <Kanban className="h-4 w-4" />
                  Kanban Board
                </Button>

                {/* Manage Members - ONLY VISIBLE TO TEAM LEADS in Team View */}
                {viewMode === "team" && isCurrentUserTeamLead && (
                  <Button
                    onClick={handleOpenAddModal}
                    disabled={isLoadingMembers}
                    size="sm"
                    className="flex h-9 items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    {isLoadingMembers ? "Loading..." : "Manage Members"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {viewMode === "team" ? (
          <>
            {/* Meeting Schedule and Checklist Status - Side by side */}
            <div className="mb-4 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
              {/* Meeting Schedule - Takes 2 columns */}
              {formatSchedule() && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                        <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Meeting Schedule
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          {formatSchedule()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Checklist Status - Takes 1 column on the right */}
              <div className={formatSchedule() ? "" : "md:col-span-3"}>
                <ChecklistStatusBanner
                  projectId={projectInfo.id}
                  teamMembers={members?.data || []}
                  teamLead={teamLead?.data || null}
                />
              </div>
            </div>

            {/* Team Overview and Attendance Points - Equal width */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Team Overview Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Team Overview
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {totalMembers} total member
                        {totalMembers !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalMembers}
                    </div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>
              </div>

              {/* Attendance Summary Card */}
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:from-blue-950/20 dark:to-cyan-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Attendance Points
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        This month's progress
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        +{monthlyAttendancePoints.totalPoints}
                      </div>
                      <div className="text-xs text-gray-500">
                        {monthlyAttendancePoints.presentDays > 0
                          ? "Earned"
                          : "No attendance yet"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {monthlyAttendancePoints.presentDays > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {monthlyAttendancePoints.presentDays} attendance{" "}
                      {monthlyAttendancePoints.presentDays === 1
                        ? "day"
                        : "days"}{" "}
                      recorded
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            {totalMembers > 0 ? (
              <CompactMemberGrid
                members={members?.data || []}
                teamLead={teamLead?.data || null}
                projectId={projectInfo.id || ""}
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 dark:border-gray-700">
                <UserPlus className="h-12 w-12 text-gray-400" />
                <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  No team members yet
                </h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Add team members to get started with your project.
                </p>
                <Button
                  onClick={handleOpenAddModal}
                  disabled={isLoadingMembers}
                  className="mt-4 h-auto max-w-[200px] px-3 py-1.5 text-xs"
                  size="sm"
                >
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Add Members
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Attendance Grid View - VISIBLE TO ALL, EDITABLE ONLY BY TEAM LEADS */
          <div className="w-full overflow-x-hidden">
            {/* Read-only notice for non-team leads */}
            {!isCurrentUserTeamLead && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  📋 You're viewing attendance in read-only mode.
                </p>
              </div>
            )}

            {useMeetingBasedAttendance && currentSchedule ? (
              <MeetingBasedAttendance
                ref={attendanceGridRef}
                teamMembers={members?.data || []}
                teamLead={teamLead?.data || null}
                projectId={projectInfo.id}
                meetingSchedule={currentSchedule.selectedDays.map((day) => ({
                  day,
                  time: currentSchedule.time,
                }))}
                onHasChangesUpdate={setHasAttendanceChanges}
                readOnly={!isCurrentUserTeamLead}
              />
            ) : (
              <AttendanceGrid
                ref={attendanceGridRef}
                teamMembers={members?.data || []}
                teamLead={teamLead?.data || null}
                projectId={projectInfo.id}
                allowWeekendMeetings={true}
                onHasChangesUpdate={setHasAttendanceChanges}
                readOnly={!isCurrentUserTeamLead}
              />
            )}
          </div>
        )}
      </div>

      {/* Add Members Modal */}
      <AddMembersModal
        isOpen={showAddModal}
        projectData={project}
        onClose={handleCloseModal}
        onUpdate={handleUpdateMembers}
      />

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={showScheduleMeetingModal}
        onClose={handleScheduleUpdate}
        projectId={projectInfo.id}
        projectName={projectInfo.name}
        teamMembers={members?.data || []}
        teamLead={teamLead?.data || null}
        currentSchedule={currentSchedule}
      />

      {/* Checklist Management Modal */}
      <ChecklistManageModal
        isOpen={showChecklistModal}
        projectId={projectInfo.id}
        projectName={projectInfo.name}
        onClose={handleCloseChecklistModal}
      />
    </>
  );
};

export default TeamDetailView;
