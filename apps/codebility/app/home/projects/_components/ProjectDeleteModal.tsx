import { deleteProject } from "@/app/home/projects/actions";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal-projects";
import toast from "react-hot-toast";

const ProjectDeleteModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "projectDeleteModal";

  const handleDialogChange = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data?.id) {
      toast.error("Project ID is missing. Unable to delete the project.");
      return;
    }

    try {
      const response = await deleteProject(data.id);

      if (response.success) {
        toast.success("Project has been deleted successfully!");
      } else {
        toast.error(
          response.error || "Failed to delete the project. Please try again.",
        );
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the project.");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        aria-describedby={undefined}
        className="w-[90%] md:w-[50%]"
      >
        <DialogHeader>
          <DialogTitle className="mb-2 text-left text-xl">
            Delete Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-lg">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-500">{data?.name}</span>?
          </p>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              variant="destructive"
              type="submit"
              className="w-full md:w-auto"
            >
              Yes, Delete it
            </Button>
            <Button
              type="button"
              className="w-full md:w-auto"
              variant="gradient"
              onClick={handleDialogChange}
            >
              No, Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDeleteModal;
