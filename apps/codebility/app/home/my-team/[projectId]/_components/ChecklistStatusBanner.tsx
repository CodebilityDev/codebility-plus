"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, User } from "lucide-react";
import { SimpleMemberData, getMembers, getTeamLead } from "@/app/home/projects/actions";
import { createClientClientComponent } from "@/utils/supabase/client";

/**
 * ChecklistStatusBanner - COMPLETE FIX FOR MISSING MEMBERS
 * 
 * FIXES APPLIED:
 * 1. ✅ Shows ALL team members (even those without checklist items)
 * 2. ✅ Shows ALL team members (even those with NULL codev_id)
 * 3. ✅ Fetches fresh member data internally
 * 4. ✅ Handles members with 0 checklist items gracefully
 * 5. ✅ Accurate member count in summary (X/10 instead of X/9)
 * 
 * CRITICAL CHANGES:
 * - Removed filter that excluded members without checklist items
 * - Now creates status for ALL members, showing 0/0 if no items assigned
 * - Total count now matches actual team size
 */

interface ChecklistStatusBannerProps {
  projectId: string;
  teamMembers?: SimpleMemberData[];
  teamLead?: SimpleMemberData | null;
}

interface MemberChecklistStatus {
  memberId: string;
  memberName: string;
  totalItems: number;
  completedItems: number;
  pendingItems: number;
}

const ChecklistStatusBanner = ({ projectId }: ChecklistStatusBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [memberStatuses, setMemberStatuses] = useState<MemberChecklistStatus[]>([]);
  
  const [freshTeamMembers, setFreshTeamMembers] = useState<SimpleMemberData[]>([]);
  const [freshTeamLead, setFreshTeamLead] = useState<SimpleMemberData | null>(null);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchFreshMemberData();
    }
  }, [projectId]);

  const fetchFreshMemberData = async () => {
    console.log("🔄 ChecklistStatusBanner: Fetching fresh member data...");
    setIsFetchingMembers(true);
    
    try {
      const teamLeadResult = await getTeamLead(projectId);
      if (teamLeadResult.data) {
        setFreshTeamLead(teamLeadResult.data);
        console.log("👑 Banner - Team Lead:", teamLeadResult.data.first_name, teamLeadResult.data.last_name);
      }

      const membersResult = await getMembers(projectId);
      if (membersResult.data) {
        setFreshTeamMembers(membersResult.data);
        console.log("👥 Banner - Fresh members fetched:", membersResult.data.length);
      }
    } catch (error) {
      console.error("❌ Banner - Error fetching fresh member data:", error);
    } finally {
      setIsFetchingMembers(false);
    }
  };

  const allMembers = freshTeamLead 
    ? [freshTeamLead, ...freshTeamMembers] 
    : freshTeamMembers;

  console.log("📊 Banner - Total members for display:", allMembers.length);

  useEffect(() => {
    if (!isFetchingMembers && allMembers.length > 0) {
      loadChecklistStatuses();
    }
  }, [projectId, allMembers.length, isFetchingMembers]);

  const loadChecklistStatuses = async () => {
    setIsLoading(true);
    const supabase = createClientClientComponent();

    if (!supabase) {
      console.error("Failed to initialize Supabase client");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔍 Banner - Loading checklist data for", allMembers.length, "members");

      // Get all checklist items for this project
      const { data: checklistData, error } = await supabase
        .from("member_checklists")
        .select("member_id, title, completed")
        .eq("project_id", projectId);

      if (error) {
        console.error("❌ Banner - Error loading checklist data:", error);
        return;
      }

      console.log("📋 Banner - Found", checklistData?.length || 0, "total checklist items");

      // 🔧 CRITICAL FIX: Create status for ALL members, not just those with items
      const statusMap: { [key: string]: MemberChecklistStatus } = {};

      allMembers.forEach(member => {
        const memberItems = checklistData?.filter(item => item.member_id === member.id) || [];
        const completedCount = memberItems.filter(item => item.completed).length;

        // Create status entry for EVERY member, even if they have 0 items
        statusMap[member.id] = {
          memberId: member.id,
          memberName: `${member.first_name} ${member.last_name}`,
          totalItems: memberItems.length,
          completedItems: completedCount,
          pendingItems: memberItems.length - completedCount
        };

        console.log(`  - ${member.first_name} ${member.last_name}: ${completedCount}/${memberItems.length} completed`);
      });

      // 🔧 CRITICAL FIX: Don't filter out members with 0 items
      // Show ALL members so the count is accurate (10/10 instead of 7/9)
      const statusArray = Object.values(statusMap)
        .sort((a, b) => {
          // Sort by: pending items (desc), then by name
          if (a.pendingItems !== b.pendingItems) {
            return b.pendingItems - a.pendingItems;
          }
          return a.memberName.localeCompare(b.memberName);
        });

      setMemberStatuses(statusArray);
      console.log("✅ Banner - Loaded statuses for ALL", statusArray.length, "members (including those with 0 items)");
    } catch (error) {
      console.error("❌ Banner - Error loading checklist statuses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary stats
  const membersWithPending = memberStatuses.filter(s => s.pendingItems > 0).length;
  const totalPendingItems = memberStatuses.reduce((sum, s) => sum + s.pendingItems, 0);
  const membersFullyCompleted = memberStatuses.filter(s => {
    // A member is "fully completed" if:
    // 1. They have items AND all are complete, OR
    // 2. They have 0 items (nothing to complete)
    return s.pendingItems === 0;
  }).length;

  console.log("📊 Banner Summary:", {
    totalMembers: memberStatuses.length,
    membersWithPending,
    membersFullyCompleted,
    totalPendingItems
  });

  if (isFetchingMembers) {
    return (
      <div className="rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 p-3">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Loading checklist status...</p>
        </div>
      </div>
    );
  }

  // Don't show if no members at all
  if (!isLoading && memberStatuses.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg overflow-hidden ${
      membersWithPending > 0
        ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950/20'
        : 'border-2 border-green-500 bg-green-50 dark:bg-green-950/20'
    }`}>
      {/* Compact Square Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-3 flex items-center justify-between ${
          membersWithPending > 0
            ? 'hover:bg-red-100 dark:hover:bg-red-900/30'
            : 'hover:bg-green-100 dark:hover:bg-green-900/30'
        } transition-colors`}
      >
        <div className="flex items-center gap-2">
          <div className={`rounded p-1.5 ${
            membersWithPending > 0
              ? 'bg-red-100 dark:bg-red-900/50'
              : 'bg-green-100 dark:bg-green-900/50'
          }`}>
            {membersWithPending > 0 ? (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              Checklist
            </p>
            {isLoading ? (
              <p className="text-xs text-gray-600 dark:text-gray-400">...</p>
            ) : membersWithPending > 0 ? (
              <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                {membersWithPending} pending
              </p>
            ) : (
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                All complete ✓
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isLoading && (
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {membersFullyCompleted}/{memberStatuses.length}
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 text-gray-500" />
          ) : (
            <ChevronDown className="h-3 w-3 text-gray-500" />
          )}
        </div>
      </button>

      {/* Expanded content - Member details */}
      {isExpanded && !isLoading && (
        <div className={`border-t ${
          membersWithPending > 0
            ? 'border-red-300 dark:border-red-800'
            : 'border-green-300 dark:border-green-800'
        } bg-white dark:bg-gray-800/50`}>
          <div className="p-4 space-y-2">
            {memberStatuses.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                No team members found
              </p>
            ) : (
              memberStatuses.map((status) => (
                <div
                  key={status.memberId}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    status.totalItems === 0
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20'
                      : status.pendingItems > 0
                      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20'
                      : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {status.memberName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {status.totalItems === 0 ? (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        No items assigned
                      </span>
                    ) : (
                      <>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {status.completedItems}/{status.totalItems} completed
                        </div>

                        {status.pendingItems > 0 ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {status.pendingItems} pending
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ✓ Complete
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={`border-t px-4 py-2 ${
            membersWithPending > 0
              ? 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10'
              : 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/10'
          }`}>
            <button
              onClick={() => {
                fetchFreshMemberData();
                loadChecklistStatuses();
              }}
              className={`text-xs font-medium ${
                membersWithPending > 0
                  ? 'text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200'
                  : 'text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200'
              }`}
            >
              ↻ Refresh Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistStatusBanner;