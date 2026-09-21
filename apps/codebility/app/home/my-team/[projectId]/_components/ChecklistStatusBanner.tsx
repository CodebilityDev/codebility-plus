"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, User } from "lucide-react";
import { SimpleMemberData } from "@/actions/projects/actions";
import { getClientSupabase } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

const loadChecklistStatuses = async (
  projectId: string,
  allMembers: { id: string; first_name: string; last_name: string }[],
): Promise<MemberChecklistStatus[]> => {
  const supabase = getClientSupabase();

  const { data: checklistData, error } = await supabase
    .from("member_checklists")
    .select("member_id, title, completed")
    .eq("project_id", projectId);

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Banner - Error loading checklist data:", error);
    }
    return [];
  }

  const statusMap: { [key: string]: MemberChecklistStatus } = {};

  allMembers.forEach((member) => {
    const memberItems =
      checklistData?.filter((item) => item.member_id === member.id) || [];
    const completedCount = memberItems.filter((item) => item.completed).length;

    statusMap[member.id] = {
      memberId: member.id,
      memberName: `${member.first_name} ${member.last_name}`,
      totalItems: memberItems.length,
      completedItems: completedCount,
      pendingItems: memberItems.length - completedCount,
    };
  });

  return Object.values(statusMap).sort((a, b) => {
    if (a.pendingItems !== b.pendingItems) {
      return b.pendingItems - a.pendingItems;
    }
    return a.memberName.localeCompare(b.memberName);
  });
};

const ChecklistStatusBanner = ({
  projectId,
  teamMembers = [],
  teamLead = null,
}: ChecklistStatusBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;

  const { data: memberStatuses = [], isPending: isLoading } = useQuery({
    queryKey: [
      "myTeam",
      "checklistStatuses",
      projectId,
      allMembers.map((m) => m.id).join(","),
    ],
    enabled: Boolean(projectId),
    staleTime: 60_000,
    queryFn: () => loadChecklistStatuses(projectId, allMembers),
  });

  // Calculate summary stats
  const membersWithPending = memberStatuses.filter(s => s.pendingItems > 0).length;
  const totalPendingItems = memberStatuses.reduce((sum, s) => sum + s.pendingItems, 0);
  const membersFullyCompleted = memberStatuses.filter(s => {
    // A member is "fully completed" if:
    // 1. They have items AND all are complete, OR
    // 2. They have 0 items (nothing to complete)
    return s.pendingItems === 0;
  }).length;

  if (isLoading && memberStatuses.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500"></div>
        <p className="text-xs text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  // Don't show if no members at all
  if (!isLoading && memberStatuses.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-md overflow-hidden border ${
      membersWithPending > 0
        ? 'border-red-300 bg-white dark:border-red-800 dark:bg-gray-800'
        : 'border-green-300 bg-white dark:border-green-800 dark:bg-gray-800'
    }`}>
      {/* Compact Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-3 py-2 flex items-center justify-between ${
          membersWithPending > 0
            ? 'hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'hover:bg-green-50 dark:hover:bg-green-900/20'
        } transition-colors`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {membersWithPending > 0 ? (
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 dark:text-white">Checklist</p>
            {isLoading ? (
              <p className="text-xs text-gray-600 dark:text-gray-400">Loading...</p>
            ) : (
              <p className={`text-xs font-medium ${
                membersWithPending > 0
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {membersWithPending > 0 ? `${totalPendingItems} pending` : 'Complete'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
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
                queryClient.invalidateQueries({
                  queryKey: ["myTeam", "checklistStatuses"],
                });
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