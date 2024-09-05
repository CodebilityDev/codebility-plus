import { deleteProjects } from "@/app/api/projects";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-projects";
import useToken from "@/hooks/use-token";

import { Dialog, DialogContent } from "@codevs/ui/dialog";

const ProjectDeleteModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "projectDeleteModal";

  const { token } = useToken();

  const handleSubmit = async () => {
    try {
      await deleteProjects(data?.id as string, token);
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <p className="text-2xl">Are you sure?</p>
        <div className="flex space-x-4">
          <Button variant="destructive" onClick={handleSubmit}>
            Yes, Delete it
          </Button>
          <Button variant="gradient" onClick={() => onClose()}>
            No, Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDeleteModal;
