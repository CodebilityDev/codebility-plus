"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Lock, Loader2 } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

/**
 * MemberChecklist - FIXED VERSION
 * 
 * KEY FIX: Shows ALL project checklist items, even if member doesn't have a row
 * 
 * CHANGES:
 * 1. Loads all unique checklist items from the project
 * 2. For each item, checks if member has a row (completed status)
 * 3. If no row exists, shows item as incomplete (placeholder)
 * 4. Team leads can toggle (creates row if needed)
 * 5. Regular members see all items in read-only mode
 * 
 * Line-by-line guidance:
 * - Lines 42-95: Fixed loadChecklistItems() - now shows ALL items
 * - Lines 97-165: Enhanced toggleComplete() - creates rows for placeholders
 * - Lines 167+: UI remains the same
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
  isPlaceholder?: boolean; // NEW: Marks items without database rows
}

interface MemberChecklistProps {
  memberId: string;      // The member whose checklist we're viewing
  projectId: string;
  isTeamLead?: boolean;  // IGNORED - will check internally
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

  // Load checklist items when component mounts
  useEffect(() => {
    if (supabase && memberId && projectId) {
      loadChecklistItems();
    }
  }, [memberId, projectId, supabase]);

  /**
   * FIXED: Load ALL unique checklist items for project
   * Creates placeholders for items member doesn't have rows for
   * 
   * OLD BEHAVIOR: Only showed items where member had a row
   * NEW BEHAVIOR: Shows ALL project items, marks missing rows as placeholders
   */
  const loadChecklistItems = async () => {
    if (!memberId || !projectId || !supabase) return;
    
    setIsLoading(true);
    try {
      console.log('=== LOADING CHECKLIST (FIXED) ===');
      console.log('Member being viewed:', memberId);
      console.log('Project ID:', projectId);
      
      // STEP 1: Get ALL unique items in this project
      // We need the template data (title, description, priority, etc.)
      const { data: allProjectItems, error: allItemsError } = await supabase
        .from("member_checklists")
        .select("title, description, priority, due_date, created_by, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (allItemsError) {
        console.error("Error loading project items:", allItemsError);
        throw allItemsError;
      }

      console.log('Total rows in project:', allProjectItems?.length || 0);

      // STEP 2: Get unique items by title (use Map to deduplicate)
      const uniqueItemsMap = new Map();
      allProjectItems?.forEach((item: any) => {
        if (!uniqueItemsMap.has(item.title)) {
          uniqueItemsMap.set(item.title, item);
        }
      });
      
      const uniqueItems = Array.from(uniqueItemsMap.values());
      console.log('Unique items found:', uniqueItems.length);

      // STEP 3: For each unique item, check if THIS MEMBER has a row
      const finalItems: ChecklistItem[] = [];
      
      for (const templateItem of uniqueItems) {
        // Try to find this member's row for this item
        const { data: memberRow, error } = await supabase
          .from("member_checklists")
          .select("*")
          .eq("project_id", projectId)
          .eq("member_id", memberId)
          .eq("title", templateItem.title)
          .maybeSingle(); // Use maybeSingle to avoid error if not found

        if (memberRow) {
          // Member has a row - use it
          console.log(`✅ Found row for "${templateItem.title}"`);
          finalItems.push(memberRow);
        } else {
          // Member doesn't have a row - create placeholder
          console.log(`⚠️ No row for "${templateItem.title}" - creating placeholder`);
          finalItems.push({
            id: `placeholder-${templateItem.title}`, // Temporary ID
            member_id: memberId,
            project_id: projectId,
            title: templateItem.title,
            description: templateItem.description,
            priority: templateItem.priority,
            completed: false, // Default to incomplete
            created_by: templateItem.created_by,
            due_date: templateItem.due_date,
            created_at: templateItem.created_at,
            updated_at: templateItem.created_at,
            isPlaceholder: true // Mark as placeholder
          });
        }
      }
      
      console.log(`Final items (with placeholders): ${finalItems.length}`);
      console.log(`Showing ALL ${finalItems.length} project items`);
      setChecklistItems(finalItems);

    } catch (error) {
      console.error("Error loading checklist items:", error);
      toast.error("Failed to load checklist items");
      setChecklistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ENHANCED: Toggle checklist completion
   * Now handles placeholders by creating database rows
   * 
   * NEW: If item is a placeholder (no DB row), creates the row first
   */
  const toggleComplete = async (
    itemId: string, 
    currentStatus: boolean, 
    itemTitle: string,
    isPlaceholder?: boolean
  ) => {
    // Permission check
    if (!isCurrentUserTeamLead) {
      console.error('❌ TOGGLE BLOCKED: Current user is not team lead');
      toast.error("🔒 Only team leads can toggle checklist completion");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    console.log('=== TOGGLING COMPLETION ===');
    console.log('Item title:', itemTitle);
    console.log('Is placeholder:', isPlaceholder);
    console.log('Current status:', currentStatus);
    console.log('New status:', !currentStatus);

    // CASE 1: Placeholder item (no database row exists)
    // We need to CREATE the row first
    if (isPlaceholder) {
      console.log('📝 Creating new row for placeholder item');
      
      const item = checklistItems.find(i => i.title === itemTitle);
      if (!item) {
        toast.error("Item not found");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("member_checklists")
          .insert({
            member_id: memberId,
            project_id: projectId,
            title: item.title,
            description: item.description,
            priority: item.priority,
            completed: true, // Set to true since we're toggling from false→true
            created_by: item.created_by,
            due_date: item.due_date,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating row:", error);
          toast.error("Failed to create checklist item");
          return;
        }

        console.log('✅ Row created successfully');
        
        // Update local state with the new real row
        setChecklistItems(prev =>
          prev.map(i =>
            i.title === itemTitle 
              ? { ...data, completed: true, isPlaceholder: false } 
              : i
          )
        );

        toast.success(`✅ "${itemTitle}" marked as completed`);
      } catch (error) {
        console.error("Error creating item:", error);
        toast.error("Failed to create checklist item");
      }
      return;
    }

    // CASE 2: Regular item (database row exists)
    // Normal toggle operation
    try {
      // Optimistic UI update
      setChecklistItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, completed: !currentStatus } : item
        )
      );

      const { error } = await supabase
        .from("member_checklists")
        .update({ 
          completed: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId);

      if (error) {
        console.error("Error updating:", error);
        toast.error("Failed to update checklist item");
        // Revert optimistic update
        setChecklistItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, completed: currentStatus } : item
          )
        );
      } else {
        console.log('✅ Toggle success');
        if (!currentStatus) {
          toast.success(`✅ "${itemTitle}" marked as completed`);
        } else {
          toast.success(`↩️ "${itemTitle}" marked as incomplete`);
        }
      }
    } catch (error) {
      console.error("Error toggling:", error);
      toast.error("Failed to update checklist item");
      // Revert optimistic update
      setChecklistItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, completed: currentStatus } : item
        )
      );
    }
  };

  // Calculate progress statistics
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
      {/* Permission Banner for Non-Team Leads */}
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

      {/* Checklist Items List */}
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
                  {/* Checkbox - Interactive only for team leads */}
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
                        ? "Click to toggle completion" 
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

                  {/* Checklist Item Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${
                        item.completed 
                          ? 'text-green-800 dark:text-green-200 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {item.title}
                      </h4>
                      {/* Placeholder indicator - only visible in dev mode */}
                      {item.isPlaceholder && process.env.NODE_ENV === 'development' && (
                        <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
                          New
                        </span>
                      )}
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

                    {/* Priority Badge */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : item.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                      </span>

                      {item.due_date && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {new Date(item.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
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
            ℹ️ Showing all {totalChecklists} checklist item{totalChecklists !== 1 ? 's' : ''} for this project. 
            {isCurrentUserTeamLead 
              ? " Check off items as this team member completes them." 
              : " Team leads will mark items as complete."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberChecklist;