import { useState, useEffect, FormEvent, useMemo } from "react";
import { X, Plus, Edit2, Trash2, Check, Lock, RefreshCw, Tag } from "lucide-react";
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
 * 3. ✅ Role-based assignment - items assigned to specific roles via explicit input
 * 4. ✅ Preserves existing data - no deletion required
 * 5. ✅ Runs automatically on modal open
 * 6. ✅ Clean toast messages (no emoji, no double quotes)
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
  const [items, setItems] = useState<{ title: string; target_role: string | null }[]>([]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editingNewTitle, setEditingNewTitle] = useState("");
  const [editingNewRole, setEditingNewRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  
  // Fresh member data (fetched internally)
  const [freshTeamLead, setFreshTeamLead] = useState<SimpleMemberData | null>(null);
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

  // Role search suggestion state
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);
  const [debouncedRole, setDebouncedRole] = useState("");

  // Parse target role from description JSON ({"target_role": "..."})
  const parseTargetRole = (description: string | null): string | null => {
    if (!description) return null;
    try {
      const parsed = JSON.parse(description);
      return parsed?.target_role ?? null;
    } catch {
      return null;
    }
  };

  // Serialize target role into description JSON
  const makeDescription = (role: string): string | null =>
    role.trim() ? JSON.stringify({ target_role: role.trim() }) : null;

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
    setIsFetchingMembers(true);
    
    try {
      const teamLeadResult = await getTeamLead(projectId);
      if (teamLeadResult.data) {
        setFreshTeamLead(teamLeadResult.data);
        setFreshTeamLeadId(teamLeadResult.data.id);
      }

      const membersResult = await getMembers(projectId);
      if (membersResult.data) {
        setFreshTeamMembers(membersResult.data);
      }
    } catch (error) {
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
        }
      }
      setAuthChecked(true);
    });
  }, [supabase, freshTeamLeadId]);

  // All team members including lead (deduped)
  const allMembersWithData = useMemo((): SimpleMemberData[] => {
    return [
      ...(freshTeamLead ? [freshTeamLead] : []),
      ...freshTeamMembers.filter(m => m.id !== freshTeamLeadId)
    ];
  }, [freshTeamLead, freshTeamMembers, freshTeamLeadId]);

  // Get all member IDs (for display purposes)
  const allMemberIds = useMemo(() => {
    return allMembersWithData.map(m => m.id).filter(Boolean);
  }, [allMembersWithData]);

  // Unique roles from team members for suggestion dropdown
  const availableRoles = useMemo(() => {
    const roles = allMembersWithData
      .map(m => m.display_position)
      .filter((p): p is string => Boolean(p));
    return [...new Set(roles)].sort();
  }, [allMembersWithData]);

  // Debounce role input for filtering suggestions
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedRole(roleInput), 300);
    return () => clearTimeout(timer);
  }, [roleInput]);

  // Filtered roles based on debounced input
  const filteredRoles = useMemo(() => {
    if (!debouncedRole.trim()) return availableRoles;
    const lower = debouncedRole.toLowerCase();
    return availableRoles.filter(role => role.toLowerCase().includes(lower));
  }, [debouncedRole, availableRoles]);

  // Get member IDs that should have a specific item based on target role
  const getMemberIdsForItem = (targetRole: string | null): string[] => {
    if (!targetRole) return allMemberIds;
    return allMembersWithData
      .filter(m => m.display_position === targetRole)
      .map(m => m.id);
  };

  // Auto-sync function - backfills missing records
  const autoSyncChecklistItems = async () => {
    if (!supabase || !projectId || allMemberIds.length === 0) return;

    setIsSyncing(true);

    try {
      const { data: existingItems, error: fetchError } = await supabase
        .from("member_checklists")
        .select("title, member_id, description")
        .eq("project_id", projectId);

      if (fetchError) {
        return;
      }

      // Group by title to see which members have which items
      // FIX: Explicitly type the accumulator to avoid implicit 'undefined' on index access
      type ItemInfo = { memberIds: string[]; description: string | null };
      const itemsByTitle = (existingItems ?? []).reduce(
        (acc: Record<string, ItemInfo>, item: { title: string; member_id: string; description: string | null }) => {
          if (!acc[item.title]) acc[item.title] = { memberIds: [], description: item.description ?? null };
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          acc[item.title]!.memberIds.push(item.member_id);
          return acc;
        },
        {} as Record<string, ItemInfo>
      );

      const uniqueTitles = Object.keys(itemsByTitle);
      let totalBackfilled = 0;

      for (const title of uniqueTitles) {
        // FIX: Use nullish coalescing to guarantee string[] (never undefined)
        const { memberIds: existingMemberIds, description } = itemsByTitle[title]!;
        const targetRole = parseTargetRole(description);
        const requiredMemberIds = getMemberIdsForItem(targetRole);
        const missingMemberIds = requiredMemberIds.filter(id => !existingMemberIds.includes(id));

        if (missingMemberIds.length > 0) {
          const { data: referenceRecord } = await supabase
            .from("member_checklists")
            .select("*")
            .eq("project_id", projectId)
            .eq("title", title)
            .limit(1)
            .single();

          const newRecords = missingMemberIds.map(memberId => ({
            project_id: projectId,
            member_id: memberId,
            title: title,
            description: referenceRecord?.description ?? null,
            priority: referenceRecord?.priority ?? "medium",
            completed: false,
            created_by: freshTeamLeadId,
            due_date: referenceRecord?.due_date ?? null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          const { error: insertError } = await supabase
            .from("member_checklists")
            .insert(newRecords);

          if (!insertError) {
            totalBackfilled += newRecords.length;
          }
        }
      }

      if (totalBackfilled > 0) {
        toast.success(`Synced ${totalBackfilled} missing checklist items`);
      }

    } catch (error) {
      toast.error("Failed to sync checklist items");
    } finally {
      setIsSyncing(false);
    }
  };

  // Load checklist items when modal opens
  useEffect(() => {
    if (isOpen && supabase && projectId && allMemberIds.length > 0 && !isFetchingMembers) {
      loadChecklistItems();
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
        .select("title, description, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load checklist items");
        setItems([]);
      } else {
        const seen = new Set<string>();
        const uniqueItems: { title: string; target_role: string | null }[] = [];
        for (const item of data) {
          const titleStr = String(item.title);
          if (!seen.has(titleStr)) {
            seen.add(titleStr);
            uniqueItems.push({ title: titleStr, target_role: parseTargetRole(item.description) });
          }
        }
        setItems(uniqueItems);
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

    if (items.some(i => i.title === newItemTitle.trim())) {
      toast.error("This item already exists");
      return;
    }

    const targetRole = roleInput.trim() || null;
    setIsLoading(true);
    try {
      const targetMemberIds = getMemberIdsForItem(targetRole);

      if (targetMemberIds.length === 0) {
        toast.error(targetRole ? `No members found with role: ${targetRole}` : "No applicable members for this item");
        setIsLoading(false);
        return;
      }

      const itemsToInsert = targetMemberIds.map(memberId => ({
        project_id: projectId,
        member_id: memberId,
        title: newItemTitle.trim(),
        description: makeDescription(roleInput),
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
        const roleLabel = targetRole ?? "All Roles";
        toast.success(`${newItemTitle.trim()} added for ${targetMemberIds.length} member${targetMemberIds.length !== 1 ? "s" : ""} (${roleLabel})`);
        setItems(prev => [...prev, { title: newItemTitle.trim(), target_role: targetRole }]);
        setNewItemTitle("");
        setRoleInput("");
      }
    } catch (error) {
      toast.error("Failed to create checklist item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle starting to edit an item
  const handleStartEdit = (item: { title: string; target_role: string | null }) => {
    if (!isTeamLead) {
      toast.error("Only team leads can edit checklist items");
      return;
    }

    setEditingTitle(item.title);
    setEditingNewTitle(item.title);
    setEditingNewRole(item.target_role ?? "");
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingTitle(null);
    setEditingNewTitle("");
    setEditingNewRole("");
  };

  // Handle saving edited item
  const handleSaveEdit = async (oldTitle: string) => {
    const currentItem = items.find(i => i.title === oldTitle);
    const newTitle = editingNewTitle.trim();
    const newRole = editingNewRole.trim() || null;
    const titleChanged = newTitle !== "" && newTitle !== oldTitle;
    const roleChanged = newRole !== currentItem?.target_role;

    if (!titleChanged && !roleChanged) {
      handleCancelEdit();
      return;
    }

    if (!newTitle) {
      handleCancelEdit();
      return;
    }

    if (titleChanged && items.some(i => i.title === newTitle)) {
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
          title: newTitle,
          description: makeDescription(editingNewRole),
          updated_at: new Date().toISOString()
        })
        .eq("project_id", projectId)
        .eq("title", oldTitle);

      if (error) {
        toast.error("Failed to update item");
      } else {
        toast.success(`Updated: ${newTitle}`);
        setItems(prev => prev.map(item => item.title === oldTitle ? { title: newTitle, target_role: newRole } : item));
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
        setItems(prev => prev.filter(item => item.title !== itemToDelete));
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
      setEditingNewRole("");
      setNewItemTitle("");
      setRoleInput("");
      onClose();
    }
  };

  // Show loading state while fetching members or checking auth
  if (isFetchingMembers || !authChecked) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="sr-only">Loading Checklist</DialogTitle>
          </DialogHeader>
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
              {allMemberIds.length} team member{allMemberIds.length !== 1 ? "s" : ""}. Items can be assigned to a specific role or all members.
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
            {/* {!isTeamLead && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 rounded mt-2">
                <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>You are viewing in read-only mode. Only team leads can add, edit, or delete items.</span>
                </p>
              </div>
            )} */}
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Add Item Form - Only visible to team leads */}
            {/* {isTeamLead && ( */}
              <form onSubmit={handleAddItem} className="flex gap-2">
                <div className="relative w-44 flex-shrink-0">
                  <Input
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onFocus={() => setShowRoleSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 150)}
                    placeholder="Target role (optional)"
                    className="bg-light-900 dark:bg-dark-200 dark:text-light-900"
                    disabled={isLoading || isFetching || isSyncing}
                  />
                  {showRoleSuggestions && filteredRoles.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredRoles.map(role => (
                        <button
                          key={role}
                          type="button"
                          onMouseDown={() => {
                            setRoleInput(role);
                            setShowRoleSuggestions(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Enter checklist item..."
                  className="flex-1 bg-light-900 dark:bg-dark-200 dark:text-light-900"
                  disabled={isLoading || isFetching || isSyncing}
                />
                <Button
                  type="submit"
                  disabled={isLoading || isFetching || isSyncing || (!newItemTitle.trim() && !roleInput.trim())}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </form>
            {/* )} */}

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
                items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    {editingTitle === item.title ? (
                      <>
                        {/* EDITING MODE */}
                        <Input
                          value={editingNewRole}
                          onChange={(e) => setEditingNewRole(e.target.value)}
                          className="w-36 flex-shrink-0"
                          placeholder="Role (optional)"
                          disabled={isLoading}
                        />
                        <Input
                          value={editingNewTitle}
                          onChange={(e) => setEditingNewTitle(e.target.value)}
                          className="flex-1"
                          disabled={isLoading}
                          autoFocus
                        />
                        <Button
                          onClick={() => handleSaveEdit(item.title)}
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
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          <span className="text-gray-900 dark:text-white">{item.title}</span>
                          {item.target_role ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              <Tag className="h-3 w-3" />
                              {item.target_role}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                              All roles
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleStartEdit(item)}
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
                            onClick={() => handleDeleteItem(item.title)}
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