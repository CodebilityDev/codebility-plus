import { deleteTask } from "@/app/home/kanban/[id]/actions";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import toast from "react-hot-toast";

const TaskDeleteModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskDeleteModal";

  const handleDialogChange = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data?.id) return;

    try {
      const response = await deleteTask(data.id);
      if (response.success) {
        toast.success("Tasks has been deleted!");
      } else {
        toast.error("Failed to delete task, please try again.");
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
            Delete Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-lg">
            Are you sure you want to delete task{" "}
            <span className="text-red-500">{data?.title}</span>?
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

export default TaskDeleteModal;
