"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMembers,
  SimpleMemberData,
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
    // AddMembersModal already saved to DB, we just need to refetch and update UI
    try {
      setIsLoadingMembers(true);
      const updatedMembersResult = await getMembers(projectInfo.id);
      if (updatedMembersResult.data) {
        setProject((prev) => ({
          ...prev,
          members: { data: updatedMembersResult.data },
        }));
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to refresh members:", error);
      toast.error("Failed to refresh member list.");
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

        <div className="flex flex-wrap items-center gap-1.5">

          <Button
            variant={viewMode === "team" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("team")}
            className={`inline-flex h-7 w-auto items-center gap-1 px-2 ${viewMode !== "team" ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" : ""}`}
          >
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs">Team</span>
          </Button>

          <Button
            variant={viewMode === "attendance" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("attendance")}
            className={`inline-flex h-7 w-auto items-center gap-1 px-2 ${viewMode !== "attendance" ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" : ""}`}
          >
            <Table className="h-3.5 w-3.5" />
            <span className="text-xs">Attendance</span>
          </Button>

          {isCurrentUserTeamLead && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenChecklistModal}
              className="inline-flex h-7 w-auto items-center gap-1 border-purple-300 px-2 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span className="text-xs">Checklist</span>
            </Button>
          )}

          <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

          <Button
            variant="outline"
            size="sm"
            className="inline-flex h-7 w-auto items-center gap-1 border-gray-300 px-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setShowScheduleMeetingModal(true)}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-xs">Schedule</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="inline-flex h-7 w-auto items-center gap-1 border-purple-300 px-2 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
            onClick={() => router.push(`/home/kanban/${projectInfo.id}`)}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span className="text-xs">Kanban</span>
          </Button>

          {viewMode === "team" && isCurrentUserTeamLead && (
            <Button
              onClick={handleOpenAddModal}
              disabled={isLoadingMembers}
              size="sm"
              className="inline-flex h-7 w-auto items-center gap-1 px-2"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span className="text-xs">Members</span>
            </Button>
          )}

          {viewMode === "attendance" && isCurrentUserTeamLead && (
            <>
              {hasAttendanceChanges && (
                <Button
                  onClick={handleSaveAttendance}
                  variant="default"
                  size="sm"
                  className="inline-flex h-7 w-auto items-center gap-1 px-2"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span className="text-xs">Save</span>
                </Button>
              )}
              <SyncAllAttendance projectId={projectInfo.id} isTeamLead={isCurrentUserTeamLead} />
            </>
          )}

        </div>

        {viewMode === "team" ? (

          <div className="space-y-4">

            <div className="mb-4 flex flex-wrap items-center gap-2">

              {formatSchedule() && (
                <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">Schedule</p>
                    <p className="whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">{formatSchedule()}</p>
                  </div>
                  {projectInfo.meeting_link && (
                    <a href={projectInfo.meeting_link} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <ExternalLink className="h-3.5 w-3.5 text-blue-600 hover:text-blue-700 dark:text-blue-400" />
                    </a>
                  )}
                </div>
              )}

              <ChecklistStatusBanner
                projectId={projectInfo.id}
                teamMembers={members?.data || []}
                teamLead={teamLead?.data || null}
              />

              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">Members</p>
                  <p className="text-lg font-bold leading-none text-gray-900 dark:text-white">{totalMembers}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">Attendance</p>
                  <p className="text-lg font-bold leading-none text-blue-600 dark:text-blue-400">+{monthlyAttendancePoints.totalPoints}</p>
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