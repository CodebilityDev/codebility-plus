import { useEffect, useState } from "react";
import {
  serviceCategoryFormValues,
  serviceCategorySchema,
} from "@/app/home/settings/services/categories/_lib/schema";
import {
  createServiceCategoryAction,
  updateServiceCategoryAction,
} from "@/app/home/settings/services/categories/action";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-service-categories";
import { IconClose } from "@/public/assets/svgs";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";

const ServiceCategoriesModal = () => {
  const { isOpen, onClose, type, data: passedData } = useModal();
  const isModalOpen = isOpen && type === "serviceCategoriesModal";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<serviceCategoryFormValues>({
    resolver: zodResolver(serviceCategorySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (passedData) {
      reset({
        name: passedData.name,
      });
    }
  }, [passedData, reset]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset({
        name: "",
      });
    }
    onClose();
  };

  const handleServiceCategorySubmit = async (
    data: serviceCategoryFormValues,
  ) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);

      let response;

      if (passedData && passedData.id) {
        response = await updateServiceCategoryAction(passedData.id, formData);
      } else {
        response = await createServiceCategoryAction(formData);
      }

      if (response.success) {
        toast.success(`${response.message}`);
        handleDialogChange(false);
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      toast.error("Error Creating/Updating Category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="flex h-[32rem] w-[50%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto">
        <button
          onClick={() => handleDialogChange(false)}
          className="absolute right-4 top-4"
        >
          <IconClose />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {passedData ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleServiceCategorySubmit)}>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <Input
                variant="lightgray"
                label="Name"
                placeholder="Enter category name"
                {...register("name")}
                className={
                  errors.name ? "border border-red-500 focus:outline-none" : ""
                }
              />
              {errors.name && (
                <span className="text-sm text-red-400">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={() => handleDialogChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              disabled={isLoading}
            >
              {passedData ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCategoriesModal;
