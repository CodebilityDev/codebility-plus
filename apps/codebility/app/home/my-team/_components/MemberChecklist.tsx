"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

/**
 * MemberChecklist - FINAL FIXED VERSION
 * 
 * FIXES:
 * 1. Shows ALL checklist items (completed AND incomplete)
 * 2. Shows completion status for THIS member
 * 3. Team leads can toggle anyone's completion
 * 4. Regular members see read-only view
 * 
 * KEY FEATURES:
 * - Loads ALL unique items for the project
 * - Gets THIS member's completion status for each item
 * - Team leads can toggle, regular members cannot
 */

interface ChecklistItem {
  id: string;
  member_id: string;
  project_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface MemberChecklistProps {
  memberId: string;
  projectId: string;
  isTeamLead?: boolean;  // Made optional with fallback
}

const MemberChecklist = ({ 
  memberId, 
  projectId, 
  isTeamLead = false 
}: MemberChecklistProps) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase client
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  // Load checklist items when component mounts
  useEffect(() => {
    if (supabase && memberId && projectId) {
      loadChecklistItems();
    }
  }, [memberId, projectId, supabase]);

  /**
   * FIXED: Load ALL unique items for project, then get THIS member's completion status
   * This ensures ALL items show up (both completed and incomplete)
   */
  const loadChecklistItems = async () => {
    if (!memberId || !projectId || !supabase) return;
    
    setIsLoading(true);
    try {
      console.log('=== LOADING MEMBER CHECKLIST ===');
      console.log('Member ID:', memberId);
      console.log('Project ID:', projectId);
      console.log('Is Team Lead:', isTeamLead);
      
      // Step 1: Get ALL unique titles for this project
      const { data: allItems, error: allItemsError } = await supabase
        .from("member_checklists")
        .select("title, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (allItemsError) {
        console.error("Error loading all items:", allItemsError);
        throw allItemsError;
      }

      console.log('All items in project:', allItems);

      // Get unique titles
      const uniqueTitles = [...new Set(allItems.map((item: any) => item.title as string))];
      console.log('Unique titles found:', uniqueTitles);

      // Step 2: For each unique title, get THIS member's row
      const memberItemsPromises = uniqueTitles.map(async (title) => {
        const { data, error } = await supabase
          .from("member_checklists")
          .select("id, member_id, project_id, title, completed, created_at, updated_at")
          .eq("project_id", projectId)
          .eq("member_id", memberId)
          .eq("title", title)
          .single();

        if (error) {
          console.error(`Error loading item "${title}" for member:`, error);
          return null;
        }

        console.log(`Item "${title}" for this member:`, data);
        return data;
      });

      const memberItems = (await Promise.all(memberItemsPromises)).filter(Boolean) as ChecklistItem[];
      
      console.log('Final member-specific items:', memberItems);
      console.log(`Showing ${memberItems.length} total items (completed + incomplete)`);
      setChecklistItems(memberItems);

    } catch (error) {
      console.error("Error loading checklist items:", error);
      toast.error("Failed to load checklist items");
      setChecklistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle checklist completion status - TEAM LEADS ONLY
   */
  const toggleComplete = async (itemId: string, currentStatus: boolean, itemTitle: string) => {
    // PERMISSION CHECK
    if (!isTeamLead) {
      console.error('TOGGLE BLOCKED: User is not team lead');
      toast.error("🔒 Only team leads can toggle checklist completion");
      return;
    }

    if (!supabase) return;

    console.log('=== TOGGLING COMPLETION ===');
    console.log('Item ID:', itemId);
    console.log('Current status:', currentStatus);
    console.log('New status:', !currentStatus);

    // Optimistic UI update
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !currentStatus } : item
      )
    );

    try {
      const { error } = await supabase
        .from("member_checklists")
        .update({ 
          completed: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId);

      if (error) {
        console.error("Error updating checklist item:", error);
        toast.error("Failed to update checklist item");
        // Revert optimistic update
        setChecklistItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, completed: currentStatus } : item
          )
        );
      } else {
        console.log('Toggle success');
        // Show toast with item name
        if (!currentStatus) {
          toast.success(`✅ "${itemTitle}" marked as completed`);
        } else {
          toast.success(`↩️ "${itemTitle}" marked as incomplete`);
        }
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
      toast.error("Failed to update checklist item");
      // Revert optimistic update
      setChecklistItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, completed: currentStatus } : item
        )
      );
    }
  };

  // Calculate progress statistics - ALL items (completed + incomplete)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading checklist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Permission Banner for Non-Team Leads */}
      {!isTeamLead && totalChecklists > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded">
          <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>You are viewing in read-only mode. Only team leads can mark items as complete.</span>
          </p>
        </div>
      )}

      {/* Progress Overview - Shows ALL items */}
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

      {/* Checklist List - Shows ALL items (completed AND incomplete) */}
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
                Navigate to project detail page to view or create checklist items
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
                  {/* Checkbox - Interactive only for team leads */}
                  <button
                    onClick={() => toggleComplete(item.id, item.completed, item.title)}
                    disabled={!isTeamLead}
                    className={`flex-shrink-0 mt-0.5 transition-transform ${
                      isTeamLead 
                        ? 'hover:scale-110 cursor-pointer' 
                        : 'cursor-not-allowed opacity-60'
                    }`}
                    title={
                      isTeamLead 
                        ? "Toggle completion" 
                        : "Only team leads can toggle completion"
                    }
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className={`h-6 w-6 ${
                        isTeamLead 
                          ? 'text-gray-400 hover:text-green-500' 
                          : 'text-gray-400'
                      }`} />
                    )}
                  </button>

                  {/* Checklist Item Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium ${
                      item.completed 
                        ? 'text-green-800 dark:text-green-200 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {item.title}
                    </h4>
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
          <p className="text-xs text-blue-700 dark:text-blue-300">
            ℹ️ Showing all {totalChecklists} checklist items for this member. 
            {isTeamLead 
              ? " Check off items as team members complete them." 
              : " Team leads will mark items as complete."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberChecklist;