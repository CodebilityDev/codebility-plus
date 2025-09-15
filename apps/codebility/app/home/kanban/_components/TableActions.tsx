"use client";

import { useEffect, useState } from "react";
import EditSprintModal from "@/components/modals/EditSprintModal";
import { useSprintStore } from "@/store/sprints-store";
import { Codev } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { KanbanSprintData } from "../[projectId]/page";
import { DeleteDialog } from "./DeleteDialog";

interface TableActionsProps {
  sprint: KanbanSprintData;
}

export function TableActions({ sprint }: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { fetchSprintsData } = useSprintStore();

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("kanban_boards")
        .delete()
        .eq("id", sprint.board_id);
      if (error) throw error;
      // onDelete?.(); // notify parent
      toast.success("Sprint and board deleted successfully");
    } catch (error) {
      console.error("Error deleting sprint:", error);
      toast.error("Failed to delete sprint");
    } finally {
      //revalidate sprints store
      fetchSprintsData();
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4  dark:text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="
    dark:bg-dark-200 
    dark:border-dark-300 
    border 
    border-gray-200
    bg-white 
    text-black 
    dark:text-white
  "
        >
          <DropdownMenuItem onClick={openEditModal}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        name={`${sprint.name}: ${sprint.kanban_board?.name}`}
        isLoading={isDeleting}
      />
      <EditSprintModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        sprint={sprint}
      />
    </>
  );
}
