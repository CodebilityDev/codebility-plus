import { useState } from "react";
import { Codev } from "@/types/home/codev";
import { SupabaseClient } from "@supabase/supabase-js";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { DeleteDialog } from "../shared/delete-dialog";

interface TableActionsProps {
  item: Codev;
  onEdit: () => void;
  onDelete?: () => void;
  supabase: SupabaseClient;
}

export function TableActions({
  item,
  onEdit,
  onDelete,
  supabase,
}: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const { error } = await supabase.from("codev").delete().eq("id", item.id);

      if (error) throw error;

      if (onDelete) {
        onDelete();
      }

      toast.success("Member deleted successfully");
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View Profile
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
        name={`${item.first_name} ${item.last_name}`}
        isLoading={isDeleting}
      />
    </>
  );
}
