"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Calendar, Plus } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// Checklist item structure matching database schema
interface ChecklistItem {
  id: string;
  member_id: string;
  project_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  completed: boolean;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface MemberChecklistProps {
  memberId: string;
  projectId: string;
  isTeamLead?: boolean; // NEW: To show/hide create button
}

const MemberChecklist = ({ memberId, projectId, isTeamLead = false }: MemberChecklistProps) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase client
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  // Load checklist items from database
  useEffect(() => {
    loadChecklistItems();
  }, [memberId, projectId, supabase]);

  const loadChecklistItems = async () => {
    if (!memberId || !projectId || !supabase) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("member_checklists")
        .select("*")
        .eq("member_id", memberId)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading checklist items:", error);
        toast.error("Failed to load checklist items");
        setChecklistItems([]);
      } else {
        setChecklistItems(data || []);
      }
    } catch (error) {
      console.error("Error loading checklist items:", error);
      setChecklistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (itemId: string, currentStatus: boolean) => {
    if (!supabase) return;

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
      } else {
        // Optimistic UI update
        setChecklistItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, completed: !currentStatus } : item
          )
        );
        toast.success(!currentStatus ? "Task completed! ✓" : "Task marked incomplete");
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
      toast.error("Failed to update task");
    }
  };

  // Calculate progress statistics
  const completedTasks = checklistItems.filter(item => item.completed).length;
  const totalTasks = checklistItems.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Get priority badge styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": 
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      case "medium": 
        return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "low": 
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      default: 
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

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
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Progress Overview
        </h3>
        
        {totalTasks > 0 ? (
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
        ) : (
          <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">No tasks yet. {isTeamLead ? 'Click the Checklist button to create tasks!' : 'Your mentor will assign tasks soon.'}</p>
          </div>
        )}
      </div>

      {/* Task List */}
      {totalTasks > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Task List
          </h3>
          
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
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-green-500" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h4 className={`font-medium ${
                        item.completed 
                          ? 'text-green-800 dark:text-green-200 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {item.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className={`text-sm mt-1 ${
                        item.completed 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {item.description}
                      </p>
                    )}
                    
                    {item.due_date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(item.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberChecklist;