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
  ExternalLink,
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
import Top3Showcase from "./Top3Showcase";
import TeamLeadersDisplay from "./TeamLeadersDisplay";

interface ProjectData {
  project: {
    id: string;
    name: string;
    meeting_link?: string | null;
  };
  teamLead: {
    data: SimpleMemberData | null;
  };
  members: {
    data: SimpleMemberData[] | null;
  };
  subLead: {
    data: SimpleMemberData | null;
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
  const [useMeetingBasedAttendance, setUseMeetingBasedAttendance] = useState(true);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<{
    selectedDays: string[];
    time: string;
  } | null>(null);
  const [monthlyAttendancePoints, setMonthlyAttendancePoints] = useState<{
    totalPoints: number;
    presentDays: number;
  }>({ totalPoints: 0, presentDays: 0 });
  const attendanceGridRef = useRef<any>(null);

  const { project: projectInfo, teamLead, members, subLead, currentUserId } = project;
  const totalMembers = (members?.data?.length || 0) + (teamLead?.data ? 1 : 0);

  const isCurrentUserTeamLead = teamLead?.data?.id
    ? currentUserId === teamLead.data.id
    : false;

  useEffect(() => {
    const loadSchedule = async () => {
      const result = await getMeetingSchedule(projectInfo.id);
      if (result.success && result.schedule) {
        setCurrentSchedule(result.schedule);
      }
    };
    loadSchedule();
  }, [projectInfo.id]);

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

  const formatSchedule = () => {
    if (!currentSchedule || !currentSchedule.selectedDays || currentSchedule.selectedDays.length === 0) {
      return null;
    }
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
    const convertTo12Hour = (time24: string) => {
      const parts = time24.split(":");
      const hours = parts[0] || "0";
      const minutes = parts[1] || "00";
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    return `${selectedDaysDisplay} at ${convertTo12Hour(currentSchedule.time)}`;
  };

  const handleOpenAddModal = () => { setShowAddModal(true); };
  const handleCloseModal = () => { setShowAddModal(false); };
  const handleOpenChecklistModal = () => { setShowChecklistModal(true); };
  const handleCloseChecklistModal = () => { setShowChecklistModal(false); };

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
          username: (teamLead as any).username ?? null,
          username_updated_at: (teamLead as any).username_updated_at ?? null,
        },
        ...selectedMembers
          .filter((member) => member.id !== teamLead.id)
          .map((member) => ({
            ...member,
            display_position: member.display_position ?? undefined,
          })),
      ];
      const result = await updateProjectMembers(projectInfo.id, updatedMembers, teamLead.id);
      if (result.success) {
        toast.success("Project members updated successfully.");
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

        {viewMode === "attendance" && isCurrentUserTeamLead && (
          <AttendanceWarningBanner
            projectId={projectInfo.id}
            isTeamLead={isCurrentUserTeamLead}
          />
        )}

        <div className="flex flex-col gap-3">

          <div className="flex items-center gap-1.5 sm:gap-2">

            <Button
              variant={viewMode === "team" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("team")}
              className={`flex h-9 items-center gap-1.5 px-2.5 text-xs sm:px-3 sm:text-sm ${viewMode !== "team" ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" : ""}`}
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="xs:inline hidden sm:inline">Team View</span>
              <span className="xs:hidden inline sm:hidden">Team</span>
            </Button>

            <Button
              variant={viewMode === "attendance" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("attendance")}
              className={`flex h-9 items-center gap-1.5 px-2.5 text-xs sm:px-3 sm:text-sm ${viewMode !== "attendance" ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" : ""}`}
            >
              <Table className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="whitespace-nowrap">Attendance</span>
            </Button>

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

          <div className="flex flex-wrap items-center gap-2">

            {viewMode === "attendance" && isCurrentUserTeamLead && hasAttendanceChanges && (
              <Button onClick={handleSaveAttendance} variant="default" size="sm" className="flex h-9 items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            )}

            <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center">

              {viewMode === "attendance" && isCurrentUserTeamLead && (
                <SyncAllAttendance projectId={projectInfo.id} isTeamLead={isCurrentUserTeamLead} />
              )}

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

              {viewMode === "team" && isCurrentUserTeamLead && (
                <Button onClick={handleOpenAddModal} disabled={isLoadingMembers} size="sm" className="flex h-9 items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {isLoadingMembers ? "Loading..." : "Manage Members"}
                </Button>
              )}

            </div>

          </div>

        </div>

        {viewMode === "team" ? (

          <div className="space-y-4">

            <div className="mb-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">

              {formatSchedule() && (
                <div className="h-full flex flex-col justify-center rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                        <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Meeting Schedule</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatSchedule()} @</span>
                          {projectInfo.meeting_link ? (
                            <a href={projectInfo.meeting_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                              Discord Channel
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-500">No link set</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={formatSchedule() ? "h-full" : "md:col-span-3"}>
                <ChecklistStatusBanner
                  projectId={projectInfo.id}
                  teamMembers={members?.data || []}
                  teamLead={teamLead?.data || null}
                />
              </div>

            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Team Overview</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{totalMembers} total member{totalMembers !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalMembers}</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:from-blue-950/20 dark:to-cyan-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">Attendance Points</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">This month's progress</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">+{monthlyAttendancePoints.totalPoints}</div>
                      <div className="text-xs text-gray-500">{monthlyAttendancePoints.presentDays > 0 ? "Earned" : "No attendance yet"}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {monthlyAttendancePoints.presentDays > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {monthlyAttendancePoints.presentDays} attendance{" "}
                      {monthlyAttendancePoints.presentDays === 1 ? "day" : "days"}{" "}
                      recorded
                    </p>
                  )}
                </div>
              </div>

            </div>

            <TeamLeadersDisplay
              teamLead={teamLead?.data || null}
              subLead={subLead?.data || null}
            />

            {isCurrentUserTeamLead && (
              <div className="mb-6 w-full">
                <Top3Showcase projectId={projectInfo.id} />
              </div>
            )}

            {totalMembers > 0 ? (
              <CompactMemberGrid
                members={members?.data || []}
                teamLead={teamLead?.data || null}
                projectId={projectInfo.id || ""}
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 dark:border-gray-700">
                <UserPlus className="h-12 w-12 text-gray-400" />
                <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No team members yet</h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Add team members to get started with your project.</p>
                <Button onClick={handleOpenAddModal} disabled={isLoadingMembers} className="mt-4 h-auto max-w-[200px] px-3 py-1.5 text-xs" size="sm">
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Add Members
                </Button>
              </div>
            )}

          </div>

        ) : (

          <div className="w-full overflow-x-hidden">

            {!isCurrentUserTeamLead && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                <p className="text-sm text-amber-800 dark:text-amber-200">📋 You're viewing attendance in read-only mode.</p>
              </div>
            )}

            {useMeetingBasedAttendance && currentSchedule ? (
              <MeetingBasedAttendance
                ref={attendanceGridRef}
                teamMembers={members?.data || []}
                teamLead={teamLead?.data || null}
                projectId={projectInfo.id}
                meetingSchedule={currentSchedule.selectedDays.map((day) => ({ day, time: currentSchedule.time }))}
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

      <AddMembersModal
        isOpen={showAddModal}
        projectData={project}
        onClose={handleCloseModal}
        onUpdate={handleUpdateMembers}
      />

      <ScheduleMeetingModal
        isOpen={showScheduleMeetingModal}
        onClose={handleScheduleUpdate}
        projectId={projectInfo.id}
        projectName={projectInfo.name}
        teamMembers={members?.data || []}
        teamLead={teamLead?.data || null}
        currentSchedule={currentSchedule}
      />

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