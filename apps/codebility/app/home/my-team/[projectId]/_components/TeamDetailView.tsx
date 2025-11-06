"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  getMembers,
  getTeamLead,
  updateProjectMembers,
  SimpleMemberData
} from "@/app/home/projects/actions";
import { Codev } from "@/types/home/codev";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Table, Calendar, TrendingUp, Save, CalendarDays, Clock, CheckSquare } from "lucide-react";
import AddMembersModal from "../../AddMembersModal";
import ChecklistManageModal from "../../_components/ChecklistManageModal";
import AttendanceGrid from "./AttendanceGrid";
import MeetingBasedAttendance from "./MeetingBasedAttendance";
import CompactMemberGrid from "./CompactMemberGrid";
import SyncAllAttendance from "./SyncAllAttendance";
import ScheduleMeetingModal from "./ScheduleMeetingModal";
import AttendanceWarningBanner from "./AttendanceWarningBanner";
import { getMeetingSchedule, getTeamMonthlyAttendancePoints } from "../actions";

/**
 * TeamDetailView - ENHANCED VERSION
 * 
 * VISIBILITY RULES:
 * ✅ Team View tab: Always visible to everyone
 * ✅ Attendance tab: Only visible to team leads
 * ✅ Checklist button: Only visible to team leads
 * ✅ Schedule Meeting button: Only visible to team leads
 * ✅ Manage Members button: Only visible to team leads (in Team View)
 * 
 * BEHAVIOR:
 * - Regular members: See only Team View tab (read-only)
 * - Team leads: Full control over all team management features
 */

interface ProjectData {
  project: {
    id: string;
    name: string;
  };
  teamLead: {
    data: SimpleMemberData;
  };
  members: {
    data: SimpleMemberData[];
  };
  currentUserId: string;  // ✅ RESTORED: Needed to check team lead status
}

interface TeamDetailViewProps {
  projectData: ProjectData;
}

const TeamDetailView = ({ projectData }: TeamDetailViewProps) => {
  const [project, setProject] = useState(projectData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [viewMode, setViewMode] = useState<"team" | "attendance">("team");
  const [hasAttendanceChanges, setHasAttendanceChanges] = useState(false);
  const [useMeetingBasedAttendance, setUseMeetingBasedAttendance] = useState(true);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<{ selectedDays: string[]; time: string } | null>(null);
  const [monthlyAttendancePoints, setMonthlyAttendancePoints] = useState<{ totalPoints: number; presentDays: number }>({ totalPoints: 0, presentDays: 0 });
  const attendanceGridRef = useRef<any>(null);

  const { project: projectInfo, teamLead, members, currentUserId } = project;
  const totalMembers = (members?.data?.length || 0) + (teamLead?.data ? 1 : 0);

  // ✅ CRITICAL: Determine if current user is team lead
  const isCurrentUserTeamLead = currentUserId === teamLead?.data?.id;

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
        currentDate.getMonth()
      );

      if (result.success) {
        setMonthlyAttendancePoints({
          totalPoints: result.totalPoints,
          presentDays: result.presentDays
        });
      }
    };
    
    if (viewMode === 'team') {
      loadAttendancePoints();
    }
  }, [projectInfo.id, viewMode]);

  // Format schedule for display
  const formatSchedule = () => {
    if (!currentSchedule || !currentSchedule.selectedDays || currentSchedule.selectedDays.length === 0) return null;

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
      .map(day => weekDays.find(d => d.value === day)?.short)
      .filter(Boolean)
      .join(", ");

    return `${selectedDaysDisplay} at ${currentSchedule.time} @ Discord`;
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
        currentDate.getMonth()
      );

      if (result.success) {
        setMonthlyAttendancePoints({
          totalPoints: result.totalPoints,
          presentDays: result.presentDays
        });
      }
    }
  }, [projectInfo.id]);

  const handleUpdateMembers = async (selectedMembers: Codev[]) => {
    try {
      setIsLoadingMembers(true);

      const teamLeadResult = await getTeamLead(projectInfo.id);
      const teamLead = teamLeadResult.data;

      if (!teamLead) {
        throw new Error('Team leader not found');
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

        const updatedProjectMembers: SimpleMemberData[] = selectedMembers
          .filter(member => member.id !== teamLead.id)
          .map(member => ({
            id: member.id,
            first_name: member.first_name,
            last_name: member.last_name,
            email_address: member.email_address,
            image_url: member.image_url ?? null,
            role: 'member',
            display_position: member.display_position ?? null,
            joined_at: new Date().toISOString(),
          }));

        setProject(prev => ({
          ...prev,
          members: { data: updatedProjectMembers }
        }));

        handleCloseModal();
      } else {
        toast.error(result.error || "Failed to update project members.");
      }
    } catch (error) {
      console.error('Failed to update members:', error);
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
      <div className="space-y-6">
        {/* Attendance Warning Banner - Only shown for team leads in attendance view */}
        {viewMode === "attendance" && isCurrentUserTeamLead && (
          <AttendanceWarningBanner 
            projectId={projectInfo.id} 
            isTeamLead={isCurrentUserTeamLead}
          />
        )}
        
        {/* Meeting Schedule Banner */}
        {formatSchedule() && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 dark:bg-blue-900/50 p-2">
                  <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Meeting Schedule</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                    {formatSchedule()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header with Tab Buttons */}
        <div className="flex items-center justify-between">
          {/* LEFT: View Mode Tabs + Checklist Button */}
          <div className="flex items-center gap-2">
            {/* Team View Tab - Always visible */}
            <Button
              variant={viewMode === "team" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("team")}
              className={`flex items-center gap-2 ${
                viewMode !== "team" ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" : ""
              }`}
            >
              <Users className="h-4 w-4" />
              Team View
            </Button>
            
            {/* Attendance Tab - ONLY VISIBLE TO TEAM LEADS */}
            {isCurrentUserTeamLead && (
              <Button
                variant={viewMode === "attendance" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("attendance")}
                className={`flex items-center gap-2 ${
                  viewMode !== "attendance" ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800" : ""
                }`}
              >
                <Table className="h-4 w-4" />
                Attendance
              </Button>
            )}

            {/* Checklist Button - ONLY VISIBLE TO TEAM LEADS */}
            {isCurrentUserTeamLead && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenChecklistModal}
                className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
              >
                <CheckSquare className="h-4 w-4" />
                Checklist
              </Button>
            )}
          </div>

          {/* RIGHT: Action Buttons */}
          <div className="flex gap-2">
            {/* Save & Sync buttons - Only for team leads in attendance view */}
            {viewMode === "attendance" && isCurrentUserTeamLead && (
              <>
                {hasAttendanceChanges && (
                  <Button
                    onClick={handleSaveAttendance}
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Changes
                  </Button>
                )}

                <SyncAllAttendance 
                  projectId={projectInfo.id} 
                  isTeamLead={isCurrentUserTeamLead}
                />
              </>
            )}
            
            {/* Manage Members - ONLY VISIBLE TO TEAM LEADS in Team View */}
            {viewMode === "team" && isCurrentUserTeamLead && (
              <Button
                onClick={handleOpenAddModal}
                disabled={isLoadingMembers}
                size="sm"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 h-auto max-w-[200px]"
              >
                <UserPlus className="h-3.5 w-3.5" />
                {isLoadingMembers ? 'Loading...' : 'Manage Members'}
              </Button>
            )}
            
            {/* Schedule Meeting - ONLY VISIBLE TO TEAM LEADS */}
            {isCurrentUserTeamLead && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 h-auto border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                title="Schedule Meetings"
                onClick={() => setShowScheduleMeetingModal(true)}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                Schedule Meeting
              </Button>
            )}
          </div>
        </div>

        {viewMode === "team" ? (
          <>
            {/* Project stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        {totalMembers} total member{totalMembers !== 1 ? 's' : ''}
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
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
                        {monthlyAttendancePoints.presentDays > 0 ? 'Earned' : 'No attendance yet'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {monthlyAttendancePoints.presentDays > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {monthlyAttendancePoints.presentDays} attendance {monthlyAttendancePoints.presentDays === 1 ? 'day' : 'days'} recorded
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
                  className="mt-4 text-xs px-3 py-1.5 h-auto max-w-[200px]"
                  size="sm"
                >
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Add Members
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Attendance Grid View - Only accessible by team leads */
          <div className="w-full overflow-x-hidden">
            {useMeetingBasedAttendance && currentSchedule ? (
              <MeetingBasedAttendance
                ref={attendanceGridRef}
                teamMembers={members?.data || []}
                teamLead={teamLead?.data || null}
                projectId={projectInfo.id}
                meetingSchedule={
                  currentSchedule.selectedDays.map(day => ({
                    day,
                    time: currentSchedule.time
                  }))
                }
                onHasChangesUpdate={setHasAttendanceChanges}
              />
            ) : (
              <AttendanceGrid
                ref={attendanceGridRef}
                teamMembers={members?.data || []}
                teamLead={teamLead?.data || null}
                projectId={projectInfo.id}
                allowWeekendMeetings={true}
                onHasChangesUpdate={setHasAttendanceChanges}
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
        teamMembers={members?.data || []}
        teamLeadId={teamLead?.data?.id || ""}
        onClose={handleCloseChecklistModal}
      />
    </>
  );
};

export default TeamDetailView;