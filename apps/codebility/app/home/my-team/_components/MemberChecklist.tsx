"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Lock, Loader2 } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

/**
 * MemberChecklist - COMPLETE WITH PROGRESS OVERVIEW
 * 
 * Shows Progress Overview section in profile mode
 */

interface ChecklistItem {
  id: string;
  member_id: string;
  project_id: string;
  title: string;
  description: string | null;
  priority: string;
  completed: boolean;
  created_by: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  isPlaceholder?: boolean;
}

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  image_url: string | null;
}

interface MemberChecklistStatus {
  member: TeamMember;
  completedCount: number;
  totalCount: number;
  allComplete: boolean;
  checklistItems: ChecklistItem[];
}

interface MemberChecklistProps {
  memberId: string;
  projectId: string;
  isTeamLead?: boolean;
  viewMode?: 'profile' | 'team';
}

const MemberChecklist = ({ 
  memberId,
  projectId, 
  isTeamLead: _unusedProp,
  viewMode = 'profile'
}: MemberChecklistProps) => {
  const [memberStatuses, setMemberStatuses] = useState<MemberChecklistStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);
  const [currentCodevId, setCurrentCodevId] = useState<string | null>(null);
  const [isCurrentUserTeamLead, setIsCurrentUserTeamLead] = useState(false);

  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
    
    if (client) {
      client.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user?.email) {
          const { data: codevData } = await client
            .from("codev")
            .select("id")
            .eq("email_address", session.user.email)
            .single();
          
          if (codevData) {
            setCurrentCodevId(codevData.id);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const checkTeamLeadStatus = async () => {
      if (!supabase || !currentCodevId || !projectId) return;

      const { data: projectMember } = await supabase
        .from("project_members")
        .select("role")
        .eq("project_id", projectId)
        .eq("codev_id", currentCodevId)
        .single();

      setIsCurrentUserTeamLead(projectMember?.role === "team_leader");
    };

    checkTeamLeadStatus();
  }, [supabase, currentCodevId, projectId]);

  useEffect(() => {
    if (supabase && currentCodevId && projectId) {
      loadChecklistItems();
    }
  }, [supabase, currentCodevId, projectId, isCurrentUserTeamLead, memberId, viewMode]);

  const loadChecklistItems = async () => {
    if (!supabase || !projectId || !currentCodevId) return;
    
    setIsLoading(true);
    try {
      let membersToShow: string[] = [];
      
      if (viewMode === 'profile') {
        membersToShow = [memberId];
      } else if (viewMode === 'team') {
        if (isCurrentUserTeamLead) {
          const { data: projectMembers, error: membersError } = await supabase
            .from("project_members")
            .select("codev_id")
            .eq("project_id", projectId);

          if (membersError) throw membersError;
          
          membersToShow = projectMembers
            ?.map((pm: any) => pm.codev_id)
            .filter((id: string) => id != null && id !== undefined && id !== '') || [];
        } else {
          membersToShow = [currentCodevId];
        }
      }

      if (membersToShow.length === 0) {
        setMemberStatuses([]);
        setIsLoading(false);
        return;
      }

      const { data: allChecklistItems, error: checklistError } = await supabase
        .from("member_checklists")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (checklistError) throw checklistError;

      const uniqueTitlesMap = new Map();
      allChecklistItems?.forEach((item: ChecklistItem) => {
        const existing = uniqueTitlesMap.get(item.title);
        
        if (!existing) {
          uniqueTitlesMap.set(item.title, {
            title: item.title,
            description: item.description,
            priority: item.priority,
            due_date: item.due_date,
            created_by: item.created_by,
            created_at: item.created_at
          });
        } else {
          const updatedItem = { ...existing };
          
          if (item.description && !existing.description) {
            updatedItem.description = item.description;
          }
          
          if (new Date(item.created_at) < new Date(existing.created_at)) {
            updatedItem.created_at = item.created_at;
            updatedItem.created_by = item.created_by;
          }
          
          uniqueTitlesMap.set(item.title, updatedItem);
        }
      });
      
      const uniqueTitles = Array.from(uniqueTitlesMap.values());
      const totalChecklistItems = uniqueTitles.length;

      const { data: memberDetails, error: memberDetailsError } = await supabase
        .from("codev")
        .select("id, first_name, last_name, email_address, image_url")
        .in("id", membersToShow);

      if (memberDetailsError) throw memberDetailsError;

      const statuses: MemberChecklistStatus[] = [];
      
      for (const member of (memberDetails || [])) {
        const memberItems = allChecklistItems?.filter(
          (item: ChecklistItem) => item.member_id === member.id
        ) || [];

        const memberChecklistItems: ChecklistItem[] = [];
        
        for (const templateItem of uniqueTitles) {
          const existingItem = memberItems.find(
            (item: ChecklistItem) => item.title === templateItem.title
          );

          if (existingItem) {
            memberChecklistItems.push(existingItem);
          } else {
            memberChecklistItems.push({
              id: `placeholder-${member.id}-${templateItem.title}`,
              member_id: member.id,
              project_id: projectId,
              title: templateItem.title,
              description: templateItem.description,
              priority: templateItem.priority,
              completed: false,
              created_by: templateItem.created_by,
              due_date: templateItem.due_date,
              created_at: templateItem.created_at,
              updated_at: templateItem.created_at,
              isPlaceholder: true
            });
          }
        }

        const completedCount = memberChecklistItems.filter(item => item.completed).length;

        statuses.push({
          member,
          completedCount,
          totalCount: totalChecklistItems,
          allComplete: completedCount === totalChecklistItems && totalChecklistItems > 0,
          checklistItems: memberChecklistItems
        });
      }

      statuses.sort((a, b) => {
        if (a.allComplete !== b.allComplete) {
          return a.allComplete ? 1 : -1;
        }
        return `${a.member.first_name} ${a.member.last_name}`.localeCompare(
          `${b.member.first_name} ${b.member.last_name}`
        );
      });

      setMemberStatuses(statuses);

    } catch (error) {
      console.error("❌ Error loading checklist:", error);
      toast.error("Failed to load checklist items");
      setMemberStatuses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (
    memberStatus: MemberChecklistStatus,
    itemId: string, 
    currentStatus: boolean, 
    itemTitle: string,
    isPlaceholder?: boolean
  ) => {
    if (!isCurrentUserTeamLead) {
      toast.error("Only team leads can toggle checklist completion");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    const newStatus = !currentStatus;
    const targetMemberId = memberStatus.member.id;

    try {
      if (isPlaceholder) {
        const item = memberStatus.checklistItems.find(i => i.title === itemTitle);
        if (!item) {
          toast.error("Item not found");
          return;
        }

        const { data: newItem, error: insertError } = await supabase
          .from("member_checklists")
          .insert({
            member_id: targetMemberId,
            project_id: projectId,
            title: item.title,
            description: item.description,
            priority: item.priority,
            completed: newStatus,
            created_by: item.created_by,
            due_date: item.due_date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          toast.error("Failed to create checklist item");
          return;
        }

        setMemberStatuses(prev =>
          prev.map(ms => {
            if (ms.member.id === targetMemberId) {
              const updatedItems = ms.checklistItems.map(i =>
                i.title === itemTitle 
                  ? { ...newItem, isPlaceholder: false } 
                  : i
              );
              const completedCount = updatedItems.filter(i => i.completed).length;
              return {
                ...ms,
                checklistItems: updatedItems,
                completedCount,
                allComplete: completedCount === ms.totalCount && ms.totalCount > 0
              };
            }
            return ms;
          })
        );

        toast.success(`${itemTitle} marked as ${newStatus ? 'completed' : 'incomplete'}`);
        return;
      }

      const { error: updateError } = await supabase
        .from("member_checklists")
        .update({ 
          completed: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId)
        .eq("member_id", targetMemberId)
        .eq("project_id", projectId);

      if (updateError) {
        toast.error("Failed to update checklist");
        return;
      }
      
      setMemberStatuses(prev =>
        prev.map(ms => {
          if (ms.member.id === targetMemberId) {
            const updatedItems = ms.checklistItems.map(item =>
              item.id === itemId 
                ? { ...item, completed: newStatus } 
                : item
            );
            const completedCount = updatedItems.filter(i => i.completed).length;
            return {
              ...ms,
              checklistItems: updatedItems,
              completedCount,
              allComplete: completedCount === ms.totalCount && ms.totalCount > 0
            };
          }
          return ms;
        })
      );

      toast.success(`${itemTitle} marked as ${newStatus ? 'completed' : 'incomplete'}`);

    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
    }
  };

  const formatName = (firstName: string, lastName: string): string => 
    `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading checklist...</p>
        </div>
      </div>
    );
  }

  // Calculate overall progress for profile view
  const profileMemberStatus = memberStatuses[0];
  const progressPercentage = profileMemberStatus 
    ? Math.round((profileMemberStatus.completedCount / profileMemberStatus.totalCount) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview - Only in Profile View */}
      {viewMode === 'profile' && profileMemberStatus && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Progress Overview</h3>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-4xl font-bold text-green-400">
                  {progressPercentage}%
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {profileMemberStatus.completedCount} of {profileMemberStatus.totalCount} checklists completed
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                profileMemberStatus.allComplete
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {profileMemberStatus.allComplete ? 'Complete' : 'In Progress'}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Permission Banner */}
      {!isCurrentUserTeamLead && memberStatuses.length > 0 && viewMode === 'team' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
            <Lock className="h-4 w-4 flex-shrink-0" />
            <span>You are viewing in read-only mode. Only team leads can mark items as complete.</span>
          </p>
        </div>
      )}

      {/* All Checklist Items */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">All Checklist Items</h3>
        
        {memberStatuses.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No checklist items yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {isCurrentUserTeamLead 
                  ? "Navigate to project detail page to create checklist items" 
                  : "Your team lead will assign checklist items soon"}
              </p>
            </div>
          </div>
        ) : (
          memberStatuses.map((memberStatus) => (
            <div key={memberStatus.member.id} className="space-y-3">
              {/* Only show member header in team view with multiple members */}
              {viewMode === 'team' && (
                <div className={`flex items-center justify-between p-4 rounded-lg border ${
                  memberStatus.allComplete
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {memberStatus.allComplete ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {formatName(memberStatus.member.first_name, memberStatus.member.last_name)}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {memberStatus.completedCount}/{memberStatus.totalCount} completed
                      </p>
                    </div>
                  </div>
                  
                  {memberStatus.allComplete ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      {memberStatus.totalCount - memberStatus.completedCount} pending
                    </span>
                  )}
                </div>
              )}

              {/* Checklist Items */}
              <div className={viewMode === 'team' ? 'ml-4 space-y-2' : 'space-y-2'}>
                {memberStatus.checklistItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      item.completed 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(
                          memberStatus,
                          item.id, 
                          item.completed, 
                          item.title,
                          item.isPlaceholder
                        )}
                        disabled={!isCurrentUserTeamLead}
                        className={`flex-shrink-0 mt-0.5 transition-transform ${
                          isCurrentUserTeamLead 
                            ? 'hover:scale-110 cursor-pointer' 
                            : 'cursor-not-allowed opacity-60'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Circle className={`h-5 w-5 ${
                            isCurrentUserTeamLead 
                              ? 'text-gray-400 hover:text-green-500' 
                              : 'text-gray-400'
                          }`} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h5 className={`text-sm font-medium ${
                          item.completed 
                            ? 'text-green-800 dark:text-green-200 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {item.title}
                        </h5>
                        
                        {item.description && (
                          <p className={`text-xs mt-1 ${
                            item.completed 
                              ? 'text-green-700 dark:text-green-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {item.description}
                          </p>
                        )}

                        {item.due_date && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Due: {new Date(item.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Banner - only in profile view */}
      {memberStatuses.length > 0 && viewMode === 'profile' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Individual checklist: Changes only affect this specific team member.
          </p>
        </div>
      )}

      {/* Info Banner - only in team view */}
      {memberStatuses.length > 0 && viewMode === 'team' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {isCurrentUserTeamLead 
              ? "Team Lead View: You can see and manage all team members' checklists."
              : "Member View: You can only see your own checklist."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberChecklist;