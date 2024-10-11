import { deleteProject } from "@/app/home/projects/actions";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-projects";
import toast from "react-hot-toast";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const ProjectDeleteModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "projectDeleteModal";

  const handleDialogChange = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data?.id) return;

    try {
      const response = await deleteProject(data.id);
      if (response.success) {
        toast.success("Project has been deleted!");
      } else {
        toast.error("Failed to delete project, please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent aria-describedby={undefined} className="w-[90%]">
        <DialogHeader>
          <DialogTitle className="mb-2 text-left text-xl">
            Delete Project
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-lg">
            Are you sure you want to delete{" "}
            <span className="text-red-500">{data?.name}</span>?
          </p>
          <div className="flex flex-col gap-4 md:flex-row">
            <Button variant="destructive" type="submit">
              Yes, Delete it
            </Button>
            <Button
              type="button"
              className="text-white"
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
