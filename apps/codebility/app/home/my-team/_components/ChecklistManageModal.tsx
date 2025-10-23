"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { X, Plus, Edit2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Input from "@/components/ui/forms/input";
import toast from "react-hot-toast";
import { createClientClientComponent } from "@/utils/supabase/client";
import { SimpleMemberData } from "@/app/home/projects/actions";

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
  const [items, setItems] = useState<string[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingNewTitle, setEditingNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  // FIXED: Get all member IDs with proper validation
  const allMemberIds = useMemo(() => {
    console.log('=== COMPUTING MEMBER IDS ===');
    console.log('teamLeadId:', teamLeadId);
    console.log('teamMembers:', teamMembers);
    
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
    
    return allIds;
  }, [teamLeadId, teamMembers]);

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

    if (!newItemTitle.trim()) {
      toast.error("Please enter a checklist item");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    // CRITICAL CHECK
    if (allMemberIds.length === 0) {
      console.error('FATAL ERROR: allMemberIds is empty!');
      console.error('teamLeadId:', teamLeadId);
      console.error('teamMembers:', teamMembers);
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
        toast.success("Checklist item added!");
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
    setEditingTitle(title);
    setEditingNewTitle(title);
  };

  const handleSaveEdit = async (oldTitle: string) => {
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
        toast.success("Checklist item updated!");
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
    if (!confirm(`Delete "${title}"?`)) return;

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("member_checklists")
        .delete()
        .eq("project_id", projectId)
        .eq("title", title);

      if (error) {
        console.error("Error deleting:", error);
        toast.error("Failed to delete checklist item");
      } else {
        toast.success("Checklist item deleted!");
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
        </DialogHeader>

        <div className="space-y-4 mt-4">
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
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first item above</p>
              </div>
            ) : (
              items.map((title) => (
                <div key={title} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  {editingTitle === title ? (
                    <>
                      <Input
                        value={editingNewTitle}
                        onChange={(e) => setEditingNewTitle(e.target.value)}
                        className="flex-1"
                        disabled={isLoading}
                        autoFocus
                      />
                      <Button onClick={() => handleSaveEdit(title)} disabled={isLoading || !editingNewTitle.trim()} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleCancelEdit} disabled={isLoading} size="sm" variant="outline">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-gray-900 dark:text-white">{title}</span>
                      <Button onClick={() => handleStartEdit(title)} disabled={isLoading} size="sm" variant="outline" className="border-blue-300 text-blue-600">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDeleteItem(title)} disabled={isLoading} size="sm" variant="outline" className="border-red-300 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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