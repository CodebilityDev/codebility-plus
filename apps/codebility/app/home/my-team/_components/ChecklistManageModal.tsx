import { useState, useEffect, FormEvent, useMemo } from "react";
import { X, Plus, Edit2, Trash2, Check, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Input from "@/components/ui/forms/input";
import toast from "react-hot-toast";
import { createClientClientComponent } from "@/utils/supabase/client";
import { SimpleMemberData, getMembers, getTeamLead } from "@/app/home/projects/actions";

/**
 * ChecklistManageModal - PRODUCTION-READY VERSION
 * 
 * FEATURES:
 * 1. ✅ Self-fetching fresh member data (fixes stale data issue)
 * 2. ✅ Auto-sync function - backfills missing checklist records for all members
 * 3. ✅ UI/UX designer exceptions - excludes them from coding-related items
 * 4. ✅ Preserves existing data - no deletion required
 * 5. ✅ Runs automatically on modal open
 * 6. ✅ Clean toast messages (no emoji, no double quotes)
 * 
 * HOW IT WORKS:
 * - Fetches current team members from database on modal open
 * - Detects when members are missing checklist items
 * - Creates missing records automatically (backfill)
 * - Identifies UI/UX designers by position
 * - Excludes UI/UX from coding-related items (github, supabase, etc.)
 * 
 * AUTHENTICATION:
 * - Self-contained (no currentUserId prop needed)
 * - Maps auth.email → codev.id
 * - Checks if user is team lead
 * 
 * PERMISSION RULES:
 * - ALL members can VIEW checklist items
 * - ONLY team leads can add, edit, or delete items
 */

interface ChecklistManageModalProps {
  isOpen: boolean;
  projectId: string;
  projectName: string;
  onClose: () => void;
}

const ChecklistManageModal = ({
  isOpen,
  projectId,
  projectName,
  onClose
}: ChecklistManageModalProps) => {
  // State
  const [items, setItems] = useState<string[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingNewTitle, setEditingNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  
  // Fresh member data (fetched internally)
  const [freshTeamMembers, setFreshTeamMembers] = useState<SimpleMemberData[]>([]);
  const [freshTeamLeadId, setFreshTeamLeadId] = useState<string>("");
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  
  // Self-contained auth
  const [currentCodevId, setCurrentCodevId] = useState<string | null>(null);
  const [isTeamLead, setIsTeamLead] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // UI/UX designer detection keywords
  const UIUX_KEYWORDS = [
    'ui', 'ux', 'design', 'designer', 'graphic', 'visual',
    'product design', 'interface', 'user experience'
  ];

  // Coding-related item keywords (items that UI/UX should skip)
  const CODING_ITEM_KEYWORDS = [
    'github', 'git', 'repository', 'code', 'coding', 'programming',
    'supabase', 'database', 'api', 'backend', 'frontend', 'npm', 'yarn',
    'typescript', 'javascript', 'react', 'next', 'deployment'
  ];

  // Initialize Supabase
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  // Fetch fresh member data when modal opens
  useEffect(() => {
    if (isOpen && projectId) {
      fetchFreshMemberData();
    }
  }, [isOpen, projectId]);

  // Fetch fresh member data from database
  const fetchFreshMemberData = async () => {
    console.log("🔄 ChecklistManageModal: Fetching fresh member data...");
    setIsFetchingMembers(true);
    
    try {
      // Fetch team lead
      const teamLeadResult = await getTeamLead(projectId);
      if (teamLeadResult.data?.id) {
        setFreshTeamLeadId(teamLeadResult.data.id);
        console.log("👑 Team Lead ID:", teamLeadResult.data.id);
      }

      // Fetch members
      const membersResult = await getMembers(projectId);
      if (membersResult.data) {
        setFreshTeamMembers(membersResult.data);
        console.log("👥 Fresh members fetched:", membersResult.data.length);
        console.log("📝 Member names:", membersResult.data.map(m => `${m.first_name} ${m.last_name} (${m.display_position || 'No position'})`));
      }
    } catch (error) {
      console.error("❌ Error fetching fresh member data:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsFetchingMembers(false);
    }
  };

  // Get current user and check auth
  useEffect(() => {
    if (!supabase || !freshTeamLeadId) return;

    supabase.auth.getSession().then(async ({ data: { session } }: any) => {
      if (session?.user?.email) {
        const { data: codevData } = await supabase
          .from("codev")
          .select("id")
          .eq("email_address", session.user.email)
          .single();
        
        if (codevData) {
          setCurrentCodevId(codevData.id);
          setIsTeamLead(codevData.id === freshTeamLeadId);
          console.log("🔐 Current user is team lead:", codevData.id === freshTeamLeadId);
        }
      }
      setAuthChecked(true);
    });
  }, [supabase, freshTeamLeadId]);

  // ✅ NEW: Check if member is UI/UX designer
  const isUIUXDesigner = (member: SimpleMemberData): boolean => {
    const position = (member.display_position || '').toLowerCase();
    return UIUX_KEYWORDS.some(keyword => position.includes(keyword));
  };

  // ✅ NEW: Check if checklist item is coding-related
  const isCodingItem = (itemTitle: string): boolean => {
    const title = itemTitle.toLowerCase();
    return CODING_ITEM_KEYWORDS.some(keyword => title.includes(keyword));
  };

  // ✅ NEW: Get member IDs that should have a specific item
  const getMemberIdsForItem = (itemTitle: string): string[] => {
    if (!freshTeamLeadId) return [];
    
    // Start with team lead
    const teamLeadMember = freshTeamMembers.find(m => m.id === freshTeamLeadId) || null;
    let validMembers = teamLeadMember ? [teamLeadMember] : [];
    
    // Add regular members
    validMembers = [...validMembers, ...freshTeamMembers.filter(m => m.id !== freshTeamLeadId)];
    
    // If item is coding-related, filter out UI/UX designers
    if (isCodingItem(itemTitle)) {
      validMembers = validMembers.filter(m => !isUIUXDesigner(m));
      console.log(`📋 Item "${itemTitle}" is coding-related, excluding UI/UX designers`);
    }
    
    return validMembers.map(m => m.id);
  };

  // Get all member IDs (for display purposes)
  const allMemberIds = useMemo(() => {
    if (!freshTeamLeadId) return [];
    
    if (!freshTeamMembers || !Array.isArray(freshTeamMembers)) {
      return [freshTeamLeadId];
    }
    
    const memberIds = freshTeamMembers.map(m => m.id).filter(Boolean);
    return [freshTeamLeadId, ...memberIds];
  }, [freshTeamLeadId, freshTeamMembers]);

  // ✅ NEW: Auto-sync function - backfills missing records
  const autoSyncChecklistItems = async () => {
    if (!supabase || !projectId || allMemberIds.length === 0) return;

    setIsSyncing(true);
    console.log("🔄 Starting auto-sync for checklist items...");

    try {
      // Get all unique checklist items for this project
      const { data: existingItems, error: fetchError } = await supabase
        .from("member_checklists")
        .select("title, member_id")
        .eq("project_id", projectId);

      if (fetchError) {
        console.error("Error fetching existing items:", fetchError);
        return;
      }

      // Group by title to see which members have which items
      const itemsByTitle: { [key: string]: string[] } = {};
      
      existingItems?.forEach((item: any) => {
        if (!itemsByTitle[item.title]) {
          itemsByTitle[item.title] = [];
        }
        itemsByTitle[item.title].push(item.member_id);
      });

      const uniqueTitles = Object.keys(itemsByTitle);
      console.log(`📋 Found ${uniqueTitles.length} unique checklist items`);

      let totalBackfilled = 0;

      // For each title, ensure all appropriate members have it
      for (const title of uniqueTitles) {
        const existingMemberIds = itemsByTitle[title];
        const requiredMemberIds = getMemberIdsForItem(title);
        const missingMemberIds = requiredMemberIds.filter(id => !existingMemberIds.includes(id));

        if (missingMemberIds.length > 0) {
          console.log(`➕ Backfilling "${title}" for ${missingMemberIds.length} members`);
          
          // Get reference record to copy settings from
          const { data: referenceRecord } = await supabase
            .from("member_checklists")
            .select("*")
            .eq("project_id", projectId)
            .eq("title", title)
            .limit(1)
            .single();

          // Create missing records
          const newRecords = missingMemberIds.map(memberId => ({
            project_id: projectId,
            member_id: memberId,
            title: title,
            description: referenceRecord?.description || null,
            priority: referenceRecord?.priority || "medium",
            completed: false, // Always start as incomplete
            created_by: freshTeamLeadId,
            due_date: referenceRecord?.due_date || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          const { error: insertError } = await supabase
            .from("member_checklists")
            .insert(newRecords);

          if (insertError) {
            console.error(`Error backfilling "${title}":`, insertError);
          } else {
            totalBackfilled += newRecords.length;
          }
        }
      }

      if (totalBackfilled > 0) {
        console.log(`✅ Auto-sync complete: Backfilled ${totalBackfilled} records`);
        toast.success(`Synced ${totalBackfilled} missing checklist items`);
      } else {
        console.log("✅ Auto-sync complete: All members already have all items");
      }

    } catch (error) {
      console.error("Error during auto-sync:", error);
      toast.error("Failed to sync checklist items");
    } finally {
      setIsSyncing(false);
    }
  };

  // Load checklist items when modal opens
  useEffect(() => {
    if (isOpen && supabase && projectId && allMemberIds.length > 0 && !isFetchingMembers) {
      loadChecklistItems();
      // ✅ Run auto-sync after loading items
      setTimeout(() => {
        autoSyncChecklistItems();
      }, 500);
    }
  }, [isOpen, supabase, projectId, allMemberIds.length, isFetchingMembers]);

  // Load checklist items from database
  const loadChecklistItems = async () => {
    if (!supabase || !projectId) return;

    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("member_checklists")
        .select("title, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load checklist items");
        setItems([]);
      } else {
        const uniqueTitles = [...new Set(data.map((item: any) => String(item.title)))] as string[];
        setItems(uniqueTitles);
      }
    } catch (error) {
      toast.error("Failed to load checklist items");
      setItems([]);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle adding new checklist item
  const handleAddItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isTeamLead) {
      toast.error("Only team leads can add checklist items");
      return;
    }

    if (!newItemTitle.trim()) {
      toast.error("Please enter a checklist item");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    if (allMemberIds.length === 0) {
      toast.error("Cannot create item: No team members found");
      return;
    }

    if (items.includes(newItemTitle.trim())) {
      toast.error("This item already exists");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Get appropriate member IDs (excludes UI/UX if coding-related)
      const targetMemberIds = getMemberIdsForItem(newItemTitle.trim());

      if (targetMemberIds.length === 0) {
        toast.error("No applicable members for this item");
        setIsLoading(false);
        return;
      }

      // Count UI/UX designers excluded
      const uiuxCount = allMemberIds.length - targetMemberIds.length;
      if (uiuxCount > 0) {
        console.log(`ℹ️ Excluding ${uiuxCount} UI/UX designer(s) from "${newItemTitle.trim()}"`);
      }

      // Create checklist item for appropriate members
      const itemsToInsert = targetMemberIds.map(memberId => ({
        project_id: projectId,
        member_id: memberId,
        title: newItemTitle.trim(),
        description: null,
        priority: "medium",
        completed: false,
        created_by: freshTeamLeadId,
        due_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from("member_checklists")
        .insert(itemsToInsert)
        .select();

      if (error) {
        toast.error(`Failed: ${error.message}`);
      } else {
        const memberText = targetMemberIds.length === allMemberIds.length
          ? `all ${allMemberIds.length} members`
          : `${targetMemberIds.length} members (excluded ${uiuxCount} UI/UX)`;
        
        toast.success(`${newItemTitle.trim()} added for ${memberText}`);
        setItems(prev => [...prev, newItemTitle.trim()]);
        setNewItemTitle("");
      }
    } catch (error) {
      toast.error("Failed to create checklist item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle starting to edit an item
  const handleStartEdit = (title: string) => {
    if (!isTeamLead) {
      toast.error("Only team leads can edit checklist items");
      return;
    }
    
    setEditingTitle(title);
    setEditingNewTitle(title);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingTitle(null);
    setEditingNewTitle("");
  };

  // Handle saving edited item
  const handleSaveEdit = async (oldTitle: string) => {
    if (!editingNewTitle.trim() || editingNewTitle.trim() === oldTitle) {
      handleCancelEdit();
      return;
    }

    if (items.includes(editingNewTitle.trim()) && editingNewTitle.trim() !== oldTitle) {
      toast.error("An item with this name already exists");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("member_checklists")
        .update({ 
          title: editingNewTitle.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("project_id", projectId)
        .eq("title", oldTitle);

      if (error) {
        toast.error("Failed to update item");
      } else {
        toast.success(`${oldTitle} updated to ${editingNewTitle.trim()}`);
        setItems(prev => prev.map(item => item === oldTitle ? editingNewTitle.trim() : item));
        handleCancelEdit();
      }
    } catch (error) {
      toast.error("Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteItem = (title: string) => {
    if (!isTeamLead) {
      toast.error("Only team leads can delete checklist items");
      return;
    }
    
    setItemToDelete(title);
    setDeleteDialogOpen(true);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete || !supabase) {
      handleCancelDelete();
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("member_checklists")
        .delete()
        .eq("project_id", projectId)
        .eq("title", itemToDelete);

      if (error) {
        toast.error("Failed to delete item");
      } else {
        toast.success(`${itemToDelete} removed from checklist`);
        setItems(prev => prev.filter(item => item !== itemToDelete));
        handleCancelDelete();
      }
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      setEditingTitle(null);
      setEditingNewTitle("");
      setNewItemTitle("");
      onClose();
    }
  };

  // Show loading state while fetching members or checking auth
  if (isFetchingMembers || !authChecked) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isFetchingMembers ? "Loading team members..." : "Loading..."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show warning if no members
  if (allMemberIds.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-red-600">Configuration Error</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Cannot load checklist: No team members found.
            </p>
            <Button onClick={handleClose} className="w-full mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* Main Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Manage Checklist
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Project: <span className="font-semibold">{projectName}</span>
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Items assigned to all {allMemberIds.length} team members (excluding UI/UX from coding items)
            </p>
            
            {/* Auto-sync indicator */}
            {isSyncing && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-2 rounded mt-2">
                <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Auto-syncing checklist items...</span>
                </p>
              </div>
            )}
            
            {/* Permission indicator for non-team leads */}
            {!isTeamLead && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded mt-2">
                <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>You are viewing in read-only mode. Only team leads can add, edit, or delete items.</span>
                </p>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Add Item Form - Only visible to team leads */}
            {isTeamLead && (
              <form onSubmit={handleAddItem} className="flex gap-2">
                <Input
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Enter checklist item..."
                  className="flex-1 bg-light-900 dark:bg-dark-200 dark:text-light-900"
                  disabled={isLoading || isFetching || isSyncing}
                />
                <Button
                  type="submit"
                  disabled={isLoading || isFetching || isSyncing || !newItemTitle.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </form>
            )}

            {/* Items List */}
            <div className="space-y-2">
              {isFetching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-600 dark:text-gray-400">No checklist items yet</p>
                  {isTeamLead && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first item above</p>
                  )}
                </div>
              ) : (
                items.map((title) => (
                  <div 
                    key={title} 
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {editingTitle === title ? (
                      <>
                        {/* EDITING MODE */}
                        <Input
                          value={editingNewTitle}
                          onChange={(e) => setEditingNewTitle(e.target.value)}
                          className="flex-1"
                          disabled={isLoading}
                          autoFocus
                        />
                        <Button 
                          onClick={() => handleSaveEdit(title)} 
                          disabled={isLoading || !editingNewTitle.trim()} 
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 p-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={handleCancelEdit} 
                          disabled={isLoading} 
                          size="sm" 
                          variant="outline"
                          className="w-10 h-10 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* VIEW MODE */}
                        <div className="flex-1">
                          <span className="text-gray-900 dark:text-white">{title}</span>
                          {isCodingItem(title) && (
                            <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                              (coding-related)
                            </span>
                          )}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleStartEdit(title)} 
                            disabled={isLoading || !isTeamLead}
                            size="sm" 
                            variant="outline" 
                            className={`w-10 h-10 p-0 ${
                              !isTeamLead 
                                ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' 
                                : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                            }`}
                            title={!isTeamLead ? "Only team leads can edit" : "Edit item"}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteItem(title)} 
                            disabled={isLoading || !isTeamLead}
                            size="sm" 
                            variant="outline" 
                            className={`w-10 h-10 p-0 ${
                              !isTeamLead 
                                ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' 
                                : 'border-red-300 text-red-600 hover:bg-red-50'
                            }`}
                            title={!isTeamLead ? "Only team leads can delete" : "Delete item"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {items.length} item{items.length !== 1 ? 's' : ''} in checklist
              </div>
            )}

            {/* Manual sync button for team leads */}
            {isTeamLead && items.length > 0 && (
              <Button
                onClick={autoSyncChecklistItems}
                disabled={isSyncing || isLoading}
                variant="outline"
                size="sm"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync All Members'}
              </Button>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleClose} disabled={isLoading} className="bg-gray-500 hover:bg-gray-600 text-white px-8">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Delete {itemToDelete}?
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
              This will remove this item for ALL team members.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isLoading}
              className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Deleting..." : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChecklistManageModal;