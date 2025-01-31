"use client";

import React, { useEffect } from "react";
import { updateRole } from "@/app/home/settings/roles/action";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import Input from "@/Components/ui/forms/input";
import { useModal } from "@/hooks/use-modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Label } from "@codevs/ui/label";

interface FormData {
  name: string;
}

const EditRoleModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editRoleModal";

  // If 'data' includes { id, name, ... }, destructure it
  // and ensure 'id' is a number in your 'Roles' interface.
  const { id: roleId, name: currentName } = data || {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    // On modal open, populate form
    if (isModalOpen && data) {
      reset({ name: currentName });
    }
  }, [isModalOpen, data, currentName, reset]);

  const handleSave = async (formData: FormData) => {
    if (!roleId) {
      toast.error("Invalid role id");
      return;
    }

    try {
      const response = await updateRole(Number(roleId), {
        name: formData.name,
      });
      if (!response.success) {
        toast.error(response.error || "Failed to update role");
        return;
      }

      toast.success("Role successfully edited!");
      onClose();
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error while updating role:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-auto w-[95%] max-w-3xl flex-col justify-items-center gap-6"
      >
        <div className="lef-0 border-black-200 absolute right-0 top-0 flex w-[100%] flex-row items-center justify-between gap-2 border-b-[1px] px-10 py-3">
          <DialogHeader className="w-full">
            <DialogTitle className="text-left text-lg">
              Edit {currentName}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="mt-16 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              className="border-light_dark dark:bg-dark-200 w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none"
              placeholder=""
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row">
          <Button
            type="button"
            variant="hollow"
            className="order-2 w-full sm:order-1 sm:w-[130px]"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="purple"
            className="order-1 w-full sm:order-2 sm:w-[130px]"
            onClick={handleSubmit(handleSave)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleModal;
