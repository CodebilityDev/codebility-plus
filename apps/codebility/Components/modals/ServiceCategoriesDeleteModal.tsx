import toast from "react-hot-toast"
import { useState } from "react"
import { Button } from "@/Components/ui/button"
import { IconClose } from "@/public/assets/svgs"
import { useModal } from "@/hooks/use-modal-service-categories"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog"
import { deleteServiceCategoryAction } from "@/app/home/settings/services/categories/action"
import { DialogDescription } from "@codevs/ui/dialog"

const ServiceCategoriesDeleteModal = () => {
  const { isOpen, onClose, type, data: passedData } = useModal();
  const isModalOpen = isOpen && type === "serviceCategoriesDeleteModal";
  const [isLoading, setIsLoading] = useState(false);

  const handleDialogChange = () => {
    onClose();
  };

  const handleServiceCategorySubmit = async () => {
    setIsLoading(true);

    try {
      const response = await deleteServiceCategoryAction(passedData?.id!);

      if (response.success) {
        toast.success(`${response.message}`);
        handleDialogChange();
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      toast.error("Error deleting service category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        className="flex h-[32rem] w-[50%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <button onClick={handleDialogChange} className="absolute right-4 top-4">
          <IconClose />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl">Are you sure you want to delete this item?</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          This will delete the item from the list. You cannot restore a deleted item.
        </DialogDescription>

        <DialogFooter className="mt-8 flex flex-col gap-2 lg:flex-row">
          <Button
            type="button"
            variant="hollow"
            className="w-max"
            onClick={handleDialogChange}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            className="w-max" 
            onClick={handleServiceCategorySubmit} 
            disabled={isLoading}
          >
            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCategoriesDeleteModal