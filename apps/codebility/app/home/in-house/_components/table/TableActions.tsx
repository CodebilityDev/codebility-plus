import { useEffect, useState } from "react";
import { Codev, InternalStatus } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { useModal } from "@/hooks/use-modal-users";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { DeleteDialog } from "../shared/DeleteDialog";

interface TableActionsProps {
  item: Codev;
  onEdit: () => void;
  onDelete?: () => void;
}

export function TableActions({ item, onEdit, onDelete }: TableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const { onOpen: openProfileModal } = useModal();

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  // Calculate years from work experience
  const calculateYearsFromExperience = (workExperience: any[]): number => {
    if (!workExperience || workExperience.length === 0) return 0;

    let totalYears = 0;
    workExperience.forEach(exp => {
      if (exp.date_from) {
        const startDate = new Date(exp.date_from);
        const endDate = exp.is_present ? new Date() : (exp.date_to ? new Date(exp.date_to) : new Date());
        const yearsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        totalYears += Math.max(0, yearsDiff);
      }
    });

    return Math.round(totalYears);
  };

  // Fetch complete profile and open modal
  const handleViewProfile = async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not available');
        return;
      }

      const { data, error } = await supabase
        .from("codev")
        .select(`
          *,
          education:education(*),
          work_experience:work_experience(*),
          projects:project_members(
            project:project_id(*)
          ),
          codev_points:codev_points(*)
        `)
        .eq('id', item.id)
        .single();

      if (error || !data) {
        console.error('Error fetching complete profile:', error);
        // Use fallback data
        const fallbackProfile: Codev = {
          ...item,
          years_of_experience: item.years_of_experience || 0,
          availability_status: item.availability_status ?? true,
          internal_status: (item.internal_status || 'GRADUATED') as InternalStatus
        };
        openProfileModal("profileModal", fallbackProfile);
        return;
      }

      // Handle years_of_experience calculation
      let finalYearsOfExperience = data.years_of_experience;

      if (finalYearsOfExperience === null || finalYearsOfExperience === undefined) {
        finalYearsOfExperience = calculateYearsFromExperience(data.work_experience || []);
      }

      const safeInternalStatus = data.internal_status as InternalStatus | undefined;

      // Create enhanced profile
      const enhancedProfile: Codev = {
        ...data,
        years_of_experience: finalYearsOfExperience,
        internal_status: safeInternalStatus,
        work_experience: data.work_experience || [],
        education: data.education || [],
        projects: data.projects || [],
        codev_points: data.codev_points || [],
        tech_stacks: data.tech_stacks || [],
        positions: data.positions || []
      };

      openProfileModal("profileModal", enhancedProfile);
    } catch (error) {
      console.error('Error in profile click handler:', error);
      // Final fallback
      const safeFallback: Codev = {
        ...item,
        years_of_experience: item.years_of_experience || 0,
        availability_status: item.availability_status ?? true,
        internal_status: (item.internal_status || 'GRADUATED') as InternalStatus
      };
      openProfileModal("profileModal", safeFallback);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase.from("codev").delete().eq("id", item.id);

      if (error) throw error;

      onDelete?.(); // notify parent
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
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <MoreHorizontal className="h-3 w-3  dark:text-white" />
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
          <DropdownMenuItem onClick={onEdit} className="text-xs">
            <Edit2 className="mr-2 h-3 w-3" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewProfile} className="text-xs">
            <Eye className="mr-2 h-3 w-3" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-xs text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-3 w-3" />
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
