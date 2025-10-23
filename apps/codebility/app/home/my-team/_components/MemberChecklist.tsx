"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

/**
 * MemberChecklist - Shows ALL project checklist items with THIS member's completion status
 * 
 * KEY FIX: 
 * - Loads ALL items for the project (not filtered by member on load)
 * - Shows THIS member's specific completion status
 * - Each member sees the same items, but can toggle their own completion independently
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
  isTeamLead?: boolean;
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
   * CORRECTED: Load ALL unique items for project, then get THIS member's completion status
   */
  const loadChecklistItems = async () => {
    if (!memberId || !projectId || !supabase) return;
    
    setIsLoading(true);
    try {
      console.log('=== LOADING CHECKLIST ===');
      console.log('Member ID:', memberId);
      console.log('Project ID:', projectId);
      
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
      const uniqueTitles = [...new Set(allItems.map((item: any) => item.title))];
      console.log('Unique titles:', uniqueTitles);

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

        return data;
      });

      const memberItems = (await Promise.all(memberItemsPromises)).filter(Boolean) as ChecklistItem[];
      
      console.log('Member-specific items:', memberItems);
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
   * Toggle task completion status for THIS member only
   */
  const toggleComplete = async (itemId: string, currentStatus: boolean) => {
    if (!supabase) return;

    console.log('Toggling item:', itemId, 'from', currentStatus, 'to', !currentStatus);

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
        console.error("Error updating task:", error);
        toast.error("Failed to update task");
        // Revert optimistic update
        setChecklistItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, completed: currentStatus } : item
          )
        );
      } else {
        console.log('Successfully toggled completion');
        toast.success(!currentStatus ? "Task completed! ✓" : "Task marked incomplete");
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
      toast.error("Failed to update task");
      // Revert optimistic update
      setChecklistItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, completed: currentStatus } : item
        )
      );
    }
  };

  // Calculate progress statistics
  const completedTasks = checklistItems.filter(item => item.completed).length;
  const totalTasks = checklistItems.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
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
      {/* Progress Overview */}
      {totalTasks > 0 && (
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
                <span>{completedTasks} of {totalTasks} tasks completed</span>
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

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Task List
        </h3>
        
        {totalTasks === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No checklist items yet</p>
              {isTeamLead && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Navigate to project detail page to create shared tasks
                </p>
              )}
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
                    onClick={() => toggleComplete(item.id, item.completed)}
                    className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
                    title="Toggle completion"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-green-500" />
                    )}
                  </button>

                  {/* Task Content - TITLE ONLY */}
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
      {totalTasks > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            ℹ️ This is a shared checklist for all team members. Check off items as you complete them.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberChecklist;