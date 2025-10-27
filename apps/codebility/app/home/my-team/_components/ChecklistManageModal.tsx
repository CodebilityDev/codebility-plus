import { useState, useEffect, FormEvent, useMemo } from "react";
import { X, Plus, Edit2, Trash2, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Input from "@/components/ui/forms/input";
import toast from "react-hot-toast";
import { createClientClientComponent } from "@/utils/supabase/client";
import { SimpleMemberData } from "@/app/home/projects/actions";

/**
 * ChecklistManageModal - TRIPLE-FIXED VERSION
 * 
 * FIXES APPLIED:
 * 1. ✅ Enhanced delete confirmation dialog (no double quotes around item name)
 * 2. ✅ Removed ALL emoji from toasts (library provides icons automatically)
 * 3. ✅ Removed ALL double quotes around item names in toasts
 * 4. ✅ Clean, professional toast messages
 * 5. ✅ Improved dialog styling and UX
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
  teamMembers: SimpleMemberData[];
  teamLeadId: string;
  onClose: () => void;
}

const ChecklistManageModal = ({
  isOpen,
  projectId,
  projectName,
  teamMembers,
  teamLeadId,
  onClose
}: ChecklistManageModalProps) => {
  // State
  const [items, setItems] = useState<string[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingNewTitle, setEditingNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  
  // Self-contained auth
  const [currentCodevId, setCurrentCodevId] = useState<string | null>(null);
  const [isTeamLead, setIsTeamLead] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Initialize Supabase and get current user
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
    
    if (client) {
      client.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user?.email) {
          // Map auth user email to codev_id
          const { data: codevData } = await client
            .from("codev")
            .select("id")
            .eq("email_address", session.user.email)
            .single();
          
          if (codevData) {
            setCurrentCodevId(codevData.id);
            // Check if this user is the team lead
            setIsTeamLead(codevData.id === teamLeadId);
          }
        }
        setAuthChecked(true);
      });
    }
  }, [teamLeadId]);

  // Get all member IDs (team lead + members)
  const allMemberIds = useMemo(() => {
    if (!teamLeadId) {
      return [];
    }
    
    if (!teamMembers || !Array.isArray(teamMembers)) {
      return [teamLeadId];
    }
    
    const memberIds = teamMembers.map(m => m.id).filter(Boolean);
    return [teamLeadId, ...memberIds];
  }, [teamLeadId, teamMembers]);

  // Load checklist items when modal opens
  useEffect(() => {
    if (isOpen && supabase && projectId) {
      loadChecklistItems();
    }
  }, [isOpen, supabase, projectId]);

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
        // Get unique titles
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

    // Permission check
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
      // Create checklist item for all team members
      const itemsToInsert = allMemberIds.map(memberId => ({
        project_id: projectId,
        member_id: memberId,
        title: newItemTitle.trim(),
        description: null,
        priority: "medium",
        completed: false,
        created_by: teamLeadId,
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
        // FIXED: No emoji, no double quotes, clean message
        toast.success(`${newItemTitle.trim()} added to checklist`);
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
      // Update all rows with this title
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
        // FIXED: No emoji, no double quotes
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

  // Handle delete button click (opens confirmation dialog)
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
      // Delete all rows with this title
      const { error } = await supabase
        .from("member_checklists")
        .delete()
        .eq("project_id", projectId)
        .eq("title", itemToDelete);

      if (error) {
        toast.error("Failed to delete item");
      } else {
        // FIXED: No emoji, no double quotes
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

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
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
              These items will be visible to all {allMemberIds.length} team members
            </p>
            
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
                  disabled={isLoading || isFetching}
                />
                <Button
                  type="submit"
                  disabled={isLoading || isFetching || !newItemTitle.trim()}
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
                        <span className="flex-1 text-gray-900 dark:text-white">{title}</span>
                        
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
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleClose} disabled={isLoading} className="bg-gray-500 hover:bg-gray-600 text-white px-8">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ENHANCED Delete Confirmation Dialog - NO DOUBLE QUOTES */}
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