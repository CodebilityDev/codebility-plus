"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Lock, Loader2 } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

/**
 * MemberChecklist - SHARED CHECKLIST VERSION
 * 
 * CRITICAL CHANGES FROM PREVIOUS VERSION:
 * 1. Toggle now affects ALL team members (shared checklist behavior)
 * 2. Completely removed priority display (no label, no badge)
 * 3. When team lead toggles item, ALL rows for that title get updated
 * 
 * BEHAVIOR:
 * - Team lead toggles "meeting" for Member A → ALL members' "meeting" toggled
 * - This is for team-wide tasks that everyone completes together
 * 
 * Line 178: UPDATE without member_id filter (affects all members)
 * Line 303: Removed priority badge completely
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
      console.log('=== LOADING SHARED CHECKLIST ===');
      console.log('Member:', memberId);
      console.log('Project:', projectId);
      
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
      console.log(`Found ${uniqueItems.length} unique items`);

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
      
      console.log(`Loaded ${finalItems.length} items`);
      setChecklistItems(finalItems);

    } catch (error) {
      console.error("Error loading checklist:", error);
      toast.error("Failed to load checklist items");
      setChecklistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle checklist - SHARED VERSION
   * 
   * CRITICAL: Updates ALL team members at once
   * This is for team-wide tasks (meeting, standup, etc.)
   */
  const toggleComplete = async (
    itemId: string, 
    currentStatus: boolean, 
    itemTitle: string,
    isPlaceholder?: boolean
  ) => {
    // Permission check
    if (!isCurrentUserTeamLead) {
      toast.error("🔒 Only team leads can toggle checklist completion");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    console.log('=== TOGGLE SHARED CHECKLIST ===');
    console.log('Item:', itemTitle);
    console.log('New status:', !currentStatus);
    console.log('Will affect: ALL team members');

    const newStatus = !currentStatus;

    try {
      // STEP 1: Update ALL members' rows for this item
      const { error: updateError } = await supabase
        .from("member_checklists")
        .update({ 
          completed: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("project_id", projectId)
        .eq("title", itemTitle);
        // ↑ NOTE: No member_id filter - affects ALL members

      if (updateError) {
        console.error("Update error:", updateError);
        
        // If update fails, try creating rows for members who don't have them
        if (updateError.code === 'PGRST116') { // No rows found
          console.log('No existing rows, creating for all members...');
          
          // Get all project members
          const { data: projectMembers } = await supabase
            .from("project_members")
            .select("codev_id")
            .eq("project_id", projectId);

          if (projectMembers && projectMembers.length > 0) {
            const item = checklistItems.find(i => i.title === itemTitle);
            if (!item) {
              toast.error("Item not found");
              return;
            }

            // Create rows for all members
            const rowsToInsert = projectMembers.map(pm => ({
              member_id: pm.codev_id,
              project_id: projectId,
              title: item.title,
              description: item.description,
              priority: item.priority,
              completed: newStatus,
              created_by: item.created_by,
              due_date: item.due_date,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }));

            const { error: insertError } = await supabase
              .from("member_checklists")
              .insert(rowsToInsert);

            if (insertError) {
              console.error("Insert error:", insertError);
              toast.error("Failed to create checklist items");
              return;
            }
          }
        } else {
          toast.error("Failed to update checklist");
          return;
        }
      }

      console.log('✅ Updated ALL team members');
      
      // Update local state
      setChecklistItems(prev =>
        prev.map(item =>
          item.title === itemTitle 
            ? { ...item, completed: newStatus, isPlaceholder: false } 
            : item
        )
      );

      if (newStatus) {
        toast.success(`✅ "${itemTitle}" marked as completed for ALL team members`);
      } else {
        toast.success(`↩️ "${itemTitle}" marked as incomplete for ALL team members`);
      }

    } catch (error) {
      console.error("Error toggling:", error);
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
                        ? "Click to toggle for ALL team members" 
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

                    {/* Due Date Only - NO PRIORITY BADGE */}
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
            ℹ️ Shared checklist: When team lead toggles an item, it affects ALL team members.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberChecklist;