"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Lock, Loader2 } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

/**
 * MemberChecklist - INDIVIDUAL MEMBER VERSION
 * 
 * FEATURES:
 * 1. ✅ Individual member checklist updates
 * 2. ✅ Clean, professional toast messages
 * 3. ✅ Team lead can toggle specific member's checklist
 * 4. ✅ Member-specific completion tracking
 * 
 * BEHAVIOR:
 * - Team lead toggles "meeting" for Member A → Only Member A's "meeting" toggled
 * - Each member has their own independent checklist status
 * - No priority display (removed completely)
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

interface MemberChecklistProps {
  memberId: string;
  projectId: string;
  isTeamLead?: boolean;
}

const MemberChecklist = ({ 
  memberId, 
  projectId, 
  isTeamLead: _unusedProp
}: MemberChecklistProps) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);
  const [currentCodevId, setCurrentCodevId] = useState<string | null>(null);
  const [isCurrentUserTeamLead, setIsCurrentUserTeamLead] = useState(false);

  // Initialize Supabase and map auth→codev
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

  // Check if CURRENT USER is team lead
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

  // Load checklist items
  useEffect(() => {
    if (supabase && memberId && projectId) {
      loadChecklistItems();
    }
  }, [memberId, projectId, supabase]);

  /**
   * Load ALL project checklist items
   * Shows status for the member being viewed
   */
  const loadChecklistItems = async () => {
    if (!memberId || !projectId || !supabase) return;
    
    setIsLoading(true);
    try {
      // Get ALL unique items in project
      const { data: allProjectItems, error: allItemsError } = await supabase
        .from("member_checklists")
        .select("title, description, priority, due_date, created_by, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (allItemsError) throw allItemsError;

      // Deduplicate by title
      const uniqueItemsMap = new Map();
      allProjectItems?.forEach((item: any) => {
        if (!uniqueItemsMap.has(item.title)) {
          uniqueItemsMap.set(item.title, item);
        }
      });
      
      const uniqueItems = Array.from(uniqueItemsMap.values());

      // For each item, get THIS MEMBER's completion status
      const finalItems: ChecklistItem[] = [];
      
      for (const templateItem of uniqueItems) {
        const { data: memberRow } = await supabase
          .from("member_checklists")
          .select("*")
          .eq("project_id", projectId)
          .eq("member_id", memberId)
          .eq("title", templateItem.title)
          .maybeSingle();

        if (memberRow) {
          finalItems.push(memberRow);
        } else {
          // Create placeholder
          finalItems.push({
            id: `placeholder-${memberId}-${templateItem.title}`,
            member_id: memberId,
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
      
      setChecklistItems(finalItems);

    } catch (error) {
      toast.error("Failed to load checklist items");
      setChecklistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle checklist - INDIVIDUAL MEMBER VERSION
   * 
   * UPDATED: Only affects the specific member being viewed
   * This allows individual tracking per team member
   */
  const toggleComplete = async (
    itemId: string, 
    currentStatus: boolean, 
    itemTitle: string,
    isPlaceholder?: boolean
  ) => {
    // Permission check
    if (!isCurrentUserTeamLead) {
      toast.error("Only team leads can toggle checklist completion");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    const newStatus = !currentStatus;

    try {
      // Handle placeholder (item doesn't exist in DB yet)
      if (isPlaceholder) {
        const item = checklistItems.find(i => i.title === itemTitle);
        if (!item) {
          toast.error("Item not found");
          return;
        }

        // Create new row for THIS specific member
        const { data: newItem, error: insertError } = await supabase
          .from("member_checklists")
          .insert({
            member_id: memberId,
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

        // Update local state with real item
        setChecklistItems(prev =>
          prev.map(i =>
            i.title === itemTitle 
              ? { ...newItem, isPlaceholder: false } 
              : i
          )
        );

        toast.success(`${itemTitle} marked as ${newStatus ? 'completed' : 'incomplete'}`);
        return;
      }

      // Update existing item for THIS specific member only
      const { error: updateError } = await supabase
        .from("member_checklists")
        .update({ 
          completed: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId)
        .eq("member_id", memberId)
        .eq("project_id", projectId);
        // ↑ NOTE: Filters by member_id - affects ONLY this member

      if (updateError) {
        toast.error("Failed to update checklist");
        return;
      }
      
      // Update local state
      setChecklistItems(prev =>
        prev.map(item =>
          item.id === itemId 
            ? { ...item, completed: newStatus } 
            : item
        )
      );

      // Clean professional messages
      toast.success(`${itemTitle} marked as ${newStatus ? 'completed' : 'incomplete'}`);

    } catch (error) {
      toast.error("Failed to update checklist");
    }
  };

  // Calculate progress
  const completedChecklists = checklistItems.filter(item => item.completed).length;
  const totalChecklists = checklistItems.length;
  const completionPercentage = totalChecklists > 0 
    ? Math.round((completedChecklists / totalChecklists) * 100) 
    : 0;

  // Loading state
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

  return (
    <div className="space-y-6">
      {/* Permission Banner */}
      {!isCurrentUserTeamLead && totalChecklists > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
            <Lock className="h-4 w-4 flex-shrink-0" />
            <span>You are viewing in read-only mode. Only team leads can mark items as complete.</span>
          </p>
        </div>
      )}

      {/* Progress Overview */}
      {totalChecklists > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Progress Overview
          </h3>
          
          <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {completionPercentage}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Complete</div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{completedChecklists} of {totalChecklists} checklist{totalChecklists !== 1 ? 's' : ''} completed</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          All Checklist Items
        </h3>
        
        {totalChecklists === 0 ? (
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
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  item.completed 
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(
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
                    title={
                      isCurrentUserTeamLead 
                        ? "Click to toggle for this member" 
                        : "Only team leads can toggle completion"
                    }
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className={`h-6 w-6 ${
                        isCurrentUserTeamLead 
                          ? 'text-gray-400 hover:text-green-500' 
                          : 'text-gray-400'
                      }`} />
                    )}
                  </button>

                  {/* Item Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium ${
                      item.completed 
                        ? 'text-green-800 dark:text-green-200 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.title}
                    </h4>
                    
                    {item.description && (
                      <p className={`text-sm mt-1 ${
                        item.completed 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {item.description}
                      </p>
                    )}

                    {/* Due Date Only - NO PRIORITY */}
                    {item.due_date && (
                      <div className="mt-2">
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
        )}
      </div>

      {/* Info Banner */}
      {totalChecklists > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Individual checklist: Changes only affect this specific team member.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberChecklist;