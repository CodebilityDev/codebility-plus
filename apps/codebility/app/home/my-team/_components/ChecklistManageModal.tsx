"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { X, Plus, Edit2, Trash2, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Input from "@/components/ui/forms/input";
import toast from "react-hot-toast";
import { createClientClientComponent } from "@/utils/supabase/client";
import { SimpleMemberData } from "@/app/home/projects/actions";

/**
 * ChecklistManageModal - FINAL FIXED VERSION
 * 
 * FIXES:
 * 1. Enhanced permission debugging
 * 2. Handles undefined currentUserId gracefully
 * 3. Clear console logging for troubleshooting
 * 
 * PERMISSION RULES:
 * - ALL members can VIEW all checklist items
 * - ONLY team leads can add, edit, or delete items
 * - Toast notifications for all actions with item names
 */

interface ChecklistManageModalProps {
  isOpen: boolean;
  projectId: string;
  projectName: string;
  teamMembers: SimpleMemberData[];
  teamLeadId: string;
  currentUserId?: string;  // Made optional with fallback
  onClose: () => void;
}

const ChecklistManageModal = ({
  isOpen,
  projectId,
  projectName,
  teamMembers,
  teamLeadId,
  currentUserId,
  onClose
}: ChecklistManageModalProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingNewTitle, setEditingNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  // ENHANCED: Check if current user is team lead with detailed logging
  const isTeamLead = useMemo(() => {
    console.log('=== PERMISSION CHECK ===');
    console.log('currentUserId:', currentUserId);
    console.log('teamLeadId:', teamLeadId);
    console.log('Match:', currentUserId === teamLeadId);
    console.log('currentUserId type:', typeof currentUserId);
    console.log('teamLeadId type:', typeof teamLeadId);
    
    // Handle undefined/null cases
    if (!currentUserId) {
      console.warn('WARNING: currentUserId is undefined/null - treating as non-team-lead');
      return false;
    }
    
    if (!teamLeadId) {
      console.warn('WARNING: teamLeadId is undefined/null');
      return false;
    }
    
    const result = currentUserId === teamLeadId;
    console.log('isTeamLead result:', result);
    console.log('========================');
    
    return result;
  }, [currentUserId, teamLeadId]);

  // Get all member IDs (team lead + members)
  const allMemberIds = useMemo(() => {
    console.log('=== COMPUTING MEMBER IDS ===');
    console.log('teamLeadId:', teamLeadId);
    console.log('teamMembers:', teamMembers);
    console.log('currentUserId:', currentUserId);
    console.log('isTeamLead:', isTeamLead);
    
    if (!teamLeadId) {
      console.error('ERROR: teamLeadId is missing!');
      return [];
    }
    
    if (!teamMembers || !Array.isArray(teamMembers)) {
      console.warn('WARNING: teamMembers is not an array, using only team lead');
      return [teamLeadId];
    }
    
    const memberIds = teamMembers.map(m => m.id).filter(Boolean);
    console.log('Member IDs from teamMembers:', memberIds);
    
    const allIds = [teamLeadId, ...memberIds];
    console.log('All member IDs (lead + members):', allIds);
    console.log('============================');
    
    return allIds;
  }, [teamLeadId, teamMembers, currentUserId, isTeamLead]);

  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  useEffect(() => {
    if (isOpen && supabase && projectId) {
      loadChecklistItems();
    }
  }, [isOpen, supabase, projectId]);

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
        console.error("Error loading checklist items:", error);
        toast.error("Failed to load checklist items");
        setItems([]);
      } else {
        const uniqueTitles = [...new Set(data.map((item: any) => String(item.title)))] as string[];
        console.log('Loaded unique titles:', uniqueTitles);
        setItems(uniqueTitles);
      }
    } catch (error) {
      console.error("Error loading checklist items:", error);
      toast.error("Failed to load checklist items");
      setItems([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Permission check
    if (!isTeamLead) {
      console.error('ADD BLOCKED: User is not team lead');
      toast.error("🔒 Only team leads can add checklist items");
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
      console.error('FATAL ERROR: allMemberIds is empty!');
      toast.error("Cannot create item: No team members found");
      return;
    }

    if (items.includes(newItemTitle.trim())) {
      toast.error("This item already exists");
      return;
    }

    setIsLoading(true);
    try {
      console.log('=== ADDING ITEM ===');
      console.log('Item title:', newItemTitle.trim());
      console.log('Creating items for members:', allMemberIds);
      
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

      console.log('Inserting items:', itemsToInsert);

      const { data, error } = await supabase
        .from("member_checklists")
        .insert(itemsToInsert)
        .select();

      if (error) {
        console.error("Insert error:", error);
        toast.error(`Failed: ${error.message}`);
      } else {
        console.log('Insert success:', data);
        toast.success(`✅ "${newItemTitle.trim()}" added to checklist`);
        setItems(prev => [...prev, newItemTitle.trim()]);
        setNewItemTitle("");
      }
    } catch (error) {
      console.error("Error creating checklist item:", error);
      toast.error("Failed to create checklist item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (title: string) => {
    // Permission check
    if (!isTeamLead) {
      console.error('EDIT BLOCKED: User is not team lead');
      toast.error("🔒 Only team leads can edit checklist items");
      return;
    }
    
    setEditingTitle(title);
    setEditingNewTitle(title);
  };

  const handleSaveEdit = async (oldTitle: string) => {
    // Permission check
    if (!isTeamLead) {
      console.error('UPDATE BLOCKED: User is not team lead');
      toast.error("🔒 Only team leads can edit checklist items");
      return;
    }

    if (!editingNewTitle.trim()) {
      toast.error("Checklist item cannot be empty");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    if (oldTitle !== editingNewTitle.trim() && items.includes(editingNewTitle.trim())) {
      toast.error("This item already exists");
      return;
    }

    setIsLoading(true);
    try {
      console.log('=== UPDATING ITEM ===');
      console.log('Old title:', oldTitle);
      console.log('New title:', editingNewTitle.trim());
      
      const { error } = await supabase
        .from("member_checklists")
        .update({ 
          title: editingNewTitle.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("project_id", projectId)
        .eq("title", oldTitle);

      if (error) {
        console.error("Error updating:", error);
        toast.error("Failed to update checklist item");
      } else {
        console.log('Update success');
        toast.success(`✅ Updated "${oldTitle}" to "${editingNewTitle.trim()}"`);
        setItems(prev => prev.map(title => title === oldTitle ? editingNewTitle.trim() : title));
        setEditingTitle(null);
        setEditingNewTitle("");
      }
    } catch (error) {
      console.error("Error updating checklist item:", error);
      toast.error("Failed to update checklist item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTitle(null);
    setEditingNewTitle("");
  };

  const handleDeleteItem = async (title: string) => {
    // Permission check
    if (!isTeamLead) {
      console.error('DELETE BLOCKED: User is not team lead');
      toast.error("🔒 Only team leads can delete checklist items");
      return;
    }

    if (!confirm(`Delete "${title}"?\n\nThis will remove this item for ALL team members.`)) return;

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    setIsLoading(true);
    try {
      console.log('=== DELETING ITEM ===');
      console.log('Title:', title);
      console.log('Project ID:', projectId);
      
      const { error } = await supabase
        .from("member_checklists")
        .delete()
        .eq("project_id", projectId)
        .eq("title", title);

      if (error) {
        console.error("Error deleting:", error);
        toast.error("Failed to delete checklist item");
      } else {
        console.log('Delete success');
        toast.success(`🗑️ "${title}" deleted from checklist`);
        setItems(prev => prev.filter(item => item !== title));
      }
    } catch (error) {
      console.error("Error deleting checklist item:", error);
      toast.error("Failed to delete checklist item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewItemTitle("");
    setEditingTitle(null);
    setEditingNewTitle("");
    onClose();
  };

  // Show warning if no members
  if (allMemberIds.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-red-600">⚠️ Configuration Error</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Cannot load checklist: No team members found.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Debug info:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
{`teamLeadId: ${teamLeadId || 'MISSING'}
currentUserId: ${currentUserId || 'MISSING'}
teamMembers: ${teamMembers ? `Array(${teamMembers.length})` : 'MISSING'}`}
            </pre>
            <Button onClick={handleClose} className="w-full mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📋 Manage Checklist
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Project: <span className="font-semibold">{projectName}</span>
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            ℹ️ These items will be visible to all {allMemberIds.length} team members
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
          
          {/* DEBUG INFO - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 text-xs font-mono">
              <div>currentUserId: {currentUserId || 'UNDEFINED'}</div>
              <div>teamLeadId: {teamLeadId || 'UNDEFINED'}</div>
              <div>isTeamLead: {isTeamLead ? 'TRUE' : 'FALSE'}</div>
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
                      {/* EDITING MODE - Team lead only */}
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
                      
                      {/* Action buttons - visible to all, but disabled for non-team leads */}
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
  );
};

export default ChecklistManageModal;