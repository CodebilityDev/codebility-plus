import { useState } from "react";
import { deleteProject } from "@/app/home/projects/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-projects";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";

const ProjectDeleteModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "projectDeleteModal";
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!data?.id) {
      toast.error("Project ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteProject(data.id);

      if (response.success) {
        toast.success("Project has been deleted successfully!");
        onClose();
      } else {
        toast.error(response.error || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-gray-500">
            Project:{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {data?.name}
            </span>
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={onSubmit}
          >
            {isLoading ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDeleteModal;
