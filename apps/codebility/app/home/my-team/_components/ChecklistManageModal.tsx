"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { X, Plus, Edit2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/forms/input";
import toast from "react-hot-toast";
import { createClientClientComponent } from "@/utils/supabase/client";
import { SimpleMemberData } from "@/app/home/projects/actions";

/**
 * ChecklistManageModal - Simple title-only checklist
 * 
 * SIMPLIFIED VERSION:
 * - ONLY title input (no description, no priority)
 * - Creates one row per member
 * - Edit/Delete functionality
 * - Saves to Supabase and persists on refresh
 */

interface ChecklistItem {
  id: string;
  member_id: string;
  project_id: string;
  title: string;
  created_at: string;
}

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
  // State management
  const [items, setItems] = useState<string[]>([]); // Just titles
  const [newItemTitle, setNewItemTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingNewTitle, setEditingNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  // Get all member IDs - with safety check
  const allMemberIds = useMemo(() => {
    if (!teamMembers || !Array.isArray(teamMembers)) {
      return teamLeadId ? [teamLeadId] : [];
    }
    return [teamLeadId, ...teamMembers.map(m => m.id)];
  }, [teamLeadId, teamMembers]);

  // Initialize Supabase client
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  // Load checklist items when modal opens
  useEffect(() => {
    if (isOpen && supabase && projectId) {
      loadChecklistItems();
    }
  }, [isOpen, supabase, projectId]);

  /**
   * Load unique checklist titles
   */
  const loadChecklistItems = async () => {
    if (!supabase || !projectId) return;

    setIsFetching(true);
    try {
      console.log('Loading items for project:', projectId);
      
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
        console.log('Loaded data:', data);
        
        // Get unique titles
        const uniqueTitles = [...new Set(data.map((item: any) => item.title))];
        console.log('Unique titles:', uniqueTitles);
        
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

  /**
   * Add new checklist item - creates one row per member
   */
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

    // Check if title already exists
    if (items.includes(newItemTitle.trim())) {
      toast.error("This item already exists");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating items for members:', allMemberIds);
      
      // Create one item for EACH member with default values for required fields
      const itemsToInsert = allMemberIds.map(memberId => ({
        project_id: projectId,
        member_id: memberId,
        title: newItemTitle.trim(),
        description: null,           // NULL for optional field
        priority: "medium",          // Default required value
        completed: false,
        created_by: teamLeadId,
        due_date: null,              // NULL for optional field
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      console.log('Inserting items:', itemsToInsert);

      const { data, error } = await supabase
        .from("member_checklists")
        .insert(itemsToInsert)
        .select();

      if (error) {
        console.error("Error creating checklist item:", error);
        toast.error(`Failed to create: ${error.message}`);
      } else {
        console.log('Created items:', data);
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

  /**
   * Start editing an item
   */
  const handleStartEdit = (title: string) => {
    setEditingTitle(title);
    setEditingNewTitle(title);
  };

  /**
   * Save edited item - updates all members' rows
   */
  const handleSaveEdit = async (oldTitle: string) => {
    if (!editingNewTitle.trim()) {
      toast.error("Checklist item cannot be empty");
      return;
    }

    if (!supabase) {
      toast.error("Database not initialized");
      return;
    }

    // Check if new title already exists
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
        console.error("Error updating checklist item:", error);
        toast.error("Failed to update checklist item");
      } else {
        toast.success("Checklist item updated!");
        setItems(prev => 
          prev.map(title => 
            title === oldTitle ? editingNewTitle.trim() : title
          )
        );
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

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingTitle(null);
    setEditingNewTitle("");
  };

  /**
   * Delete checklist item - deletes all members' rows
   */
  const handleDeleteItem = async (title: string) => {
    if (!confirm(`Delete "${title}"?`)) {
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
        .delete()
        .eq("project_id", projectId)
        .eq("title", title);

      if (error) {
        console.error("Error deleting checklist item:", error);
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

  /**
   * Reset form when closing modal
   */
  const handleClose = () => {
    setNewItemTitle("");
    setEditingTitle(null);
    setEditingNewTitle("");
    onClose();
  };

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
            ℹ️ These items will be visible to all team members
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Add New Item Form - ONLY TITLE */}
          <form onSubmit={handleAddItem} className="flex gap-2">
            <Input
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Enter checklist item..."
              className="flex-1 bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500"
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

          {/* Checklist Items List */}
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
                <p className="text-gray-600 dark:text-gray-400">
                  No checklist items yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Add your first item above
                </p>
              </div>
            ) : (
              items.map((title) => (
                <div
                  key={title}
                  className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  {/* Edit Mode */}
                  {editingTitle === title ? (
                    <>
                      <Input
                        value={editingNewTitle}
                        onChange={(e) => setEditingNewTitle(e.target.value)}
                        className="flex-1 bg-light-900 dark:bg-dark-200 dark:text-light-900"
                        disabled={isLoading}
                        autoFocus
                      />
                      <Button
                        onClick={() => handleSaveEdit(title)}
                        disabled={isLoading || !editingNewTitle.trim()}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Display Mode - TITLE ONLY */}
                      <span className="flex-1 text-gray-900 dark:text-white">
                        {title}
                      </span>
                      <Button
                        onClick={() => handleStartEdit(title)}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteItem(title)}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Item Count */}
          {items.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {items.length} item{items.length !== 1 ? 's' : ''} in checklist
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleClose}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistManageModal;