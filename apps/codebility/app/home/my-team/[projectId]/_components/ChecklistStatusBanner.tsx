"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, User } from "lucide-react";
import { SimpleMemberData } from "@/app/home/projects/actions";
import { createClientClientComponent } from "@/utils/supabase/client";

interface ChecklistStatusBannerProps {
  projectId: string;
  teamMembers: SimpleMemberData[];
  teamLead: SimpleMemberData | null;
}

interface MemberChecklistStatus {
  memberId: string;
  memberName: string;
  totalItems: number;
  completedItems: number;
  pendingItems: number;
}

const ChecklistStatusBanner = ({ projectId, teamMembers, teamLead }: ChecklistStatusBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [memberStatuses, setMemberStatuses] = useState<MemberChecklistStatus[]>([]);

  const allMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;

  useEffect(() => {
    loadChecklistStatuses();
  }, [projectId, allMembers.length]);

  const loadChecklistStatuses = async () => {
    setIsLoading(true);
    const supabase = createClientClientComponent();

    try {
      // Get all checklist items for this project
      const { data: checklistData, error } = await supabase
        .from("member_checklists")
        .select("member_id, title, completed")
        .eq("project_id", projectId);

      if (error) {
        console.error("Error loading checklist data:", error);
        return;
      }

      // Process data by member
      const statusMap: { [key: string]: MemberChecklistStatus } = {};

      allMembers.forEach(member => {
        const memberItems = checklistData?.filter(item => item.member_id === member.id) || [];
        const completedCount = memberItems.filter(item => item.completed).length;

        statusMap[member.id] = {
          memberId: member.id,
          memberName: `${member.first_name} ${member.last_name}`,
          totalItems: memberItems.length,
          completedItems: completedCount,
          pendingItems: memberItems.length - completedCount
        };
      });

      // Convert to array and sort by pending items (most pending first)
      const statusArray = Object.values(statusMap)
        .filter(status => status.totalItems > 0) // Only show members with checklist items
        .sort((a, b) => b.pendingItems - a.pendingItems);

      setMemberStatuses(statusArray);
    } catch (error) {
      console.error("Error loading checklist statuses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary stats
  const membersWithPending = memberStatuses.filter(s => s.pendingItems > 0).length;
  const totalPendingItems = memberStatuses.reduce((sum, s) => sum + s.pendingItems, 0);
  const membersFullyCompleted = memberStatuses.filter(s => s.pendingItems === 0).length;

  // Don't show if no checklist items exist
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
                {totalPendingItems} pending
              </p>
            ) : (
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                Complete ✓
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isLoading && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
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
                No checklist items assigned yet
              </p>
            ) : (
              memberStatuses.map((status) => (
                <div
                  key={status.memberId}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    status.pendingItems > 0
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
              onClick={loadChecklistStatuses}
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
