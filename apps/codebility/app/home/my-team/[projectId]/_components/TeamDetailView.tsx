"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { 
  getMembers, 
  getTeamLead, 
  updateProjectMembers,
  SimpleMemberData 
} from "@/app/home/projects/actions";
import { Codev } from "@/types/home/codev";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Table, Calendar, TrendingUp, Save, CalendarDays } from "lucide-react";
import AddMembersModal from "../../AddMembersModal";
import AttendanceGrid from "./AttendanceGrid";
import CompactMemberGrid from "./CompactMemberGrid";
import SyncAllAttendance from "./SyncAllAttendance";

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
  currentUserId?: string;
}

interface TeamDetailViewProps {
  projectData: ProjectData;
}

const TeamDetailView = ({ projectData }: TeamDetailViewProps) => {
  const [project, setProject] = useState(projectData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [viewMode, setViewMode] = useState<"team" | "attendance">("team");
  const [hasAttendanceChanges, setHasAttendanceChanges] = useState(false);
  const [saveAttendanceFunction, setSaveAttendanceFunction] = useState<(() => Promise<void>) | null>(null);
  const [allowWeekendMeetings, setAllowWeekendMeetings] = useState(false);

  const { project: projectInfo, teamLead, members, currentUserId } = project;
  const membersData = members?.data || [];
  const teamLeadData = teamLead?.data || null;
  const totalMembers = membersData.length + (teamLeadData ? 1 : 0);
  
  // Check if current user is the team lead
  const isTeamLead = currentUserId && teamLeadData && teamLeadData.id === currentUserId;

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleUpdateMembers = async (selectedMembers: Codev[]) => {
    try {
      setIsLoadingMembers(true);
      
      // Get current team lead
      const teamLeadResult = await getTeamLead(projectInfo.id);
      const teamLead = teamLeadResult.data;
      
      if (!teamLead) {
        throw new Error('Team leader not found');
      }

      // Prepare updated members array
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

      // Update project members
      const result = await updateProjectMembers(
        projectInfo.id,
        updatedMembers,
        teamLead.id,
      );

      if (result.success) {
        toast.success("Project members updated successfully.");
        
        // Update local state
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "team" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("team")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Team View
            </Button>
            {(isTeamLead || !currentUserId) && (
              <Button
                variant={viewMode === "attendance" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("attendance")}
                className="flex items-center gap-2"
              >
                <Table className="h-4 w-4" />
                Attendance
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {viewMode === "attendance" && (
              <>
                {hasAttendanceChanges && saveAttendanceFunction && (
                  <Button
                    onClick={saveAttendanceFunction}
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
                  isTeamLead={isTeamLead || !currentUserId} 
                />
              </>
            )}
            {viewMode === "team" && (
              <Button
                onClick={handleOpenAddModal}
                disabled={isLoadingMembers}
                size="sm"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 h-auto max-w-[200px]"
              >
                <UserPlus className="h-3.5 w-3.5" />
                {isLoadingMembers ? 'Loading...' : 'Add Members'}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs"
              title="Schedule Meetings"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Schedule Meeting
            </Button>
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
                        +{totalMembers * 20}
                      </div>
                      <div className="text-xs text-gray-500">Est. Points</div>
                    </div>
                  </div>
                </div>
                {isTeamLead && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Click "Attendance" tab to manage team attendance
                  </p>
                )}
              </div>
            </div>

            {/* Team Members Grid */}
            {totalMembers > 0 ? (
              <CompactMemberGrid 
                members={membersData}
                teamLead={teamLeadData}
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
          /* Attendance Grid View */
          <AttendanceGrid
            teamMembers={membersData}
            teamLead={teamLeadData}
            projectId={projectInfo.id}
            allowWeekendMeetings={allowWeekendMeetings}
            onSaveStateChange={(hasChanges, saveFunction) => {
              setHasAttendanceChanges(hasChanges);
              setSaveAttendanceFunction(() => saveFunction);
            }}
          />
        )}
      </div>

      {/* Add Members Modal */}
      <AddMembersModal
        isOpen={showAddModal}
        projectData={project}
        onClose={handleCloseModal}
        onUpdate={handleUpdateMembers}
      />
    </>
  );
};

export default TeamDetailView;