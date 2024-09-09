import { Button } from "@/Components/ui/button"

import { useModal } from "@/hooks/use-modal-projects"
import { Dialog, DialogContent } from "@codevs/ui/dialog"

import useToken from "@/hooks/use-token"
import { deleteProjects } from "@/app/api/projects"
import { DeleteData } from "@/app/home/projects/actions"
import toast from "react-hot-toast"

const ProjectDeleteModal = () => {


  const { isOpen, onClose, type, data } = useModal()

  const { id } = data || {}


  const isModalOpen = isOpen && type === "projectDeleteModal";

  const { token } = useToken();

  // const handleSubmit = async () => {
  //   try {
  //     await deleteProjects(data?.id as string, token)
  //     onClose()
  //   } catch (error) {
  //     console.error("Error creating project:", error)
  //   }
  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget);

    try {
      await DeleteData(formData); // Pass form data to DeleteData
      onClose(); // Close the modal after successful deletion
      toast.success("Project has been deleted!")
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent>

         <form onSubmit={handleSubmit}>
        <p className="text-2xl">Are you sure?</p>

        <input type="hidden" name="userId" value={id} /> 

        <div className="flex space-x-4">
          <Button variant="destructive" type="submit">
            Yes, Delete it
          </Button>
          <Button variant="gradient"  onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                onClose();
              }}>
            No, Cancel
          </Button>
        </div>

        </form>

        

      </DialogContent>
    </Dialog>
  );
};

export default ProjectDeleteModal;
