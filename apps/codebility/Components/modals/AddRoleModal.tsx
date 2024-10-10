"use client";

import React, { useState } from "react";
import { createRole } from "@/app/home/settings/roles/action";
import { Button } from "@/Components/ui/button";
import Input from "@/Components/ui/forms/input";
import { useModal } from "@/hooks/use-modal";
import { IconClose } from "@/public/assets/svgs";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Label } from "@codevs/ui/label";

const AddRoleModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "addRoleModal";

  const [newRole, setNewRole] = useState<string>("");

  const handleClose = () => {
    setNewRole("");
    onClose();
  };

  const handleSave = async () => {
    if (!newRole) return toast.error("Name is Empty");

    try {
      await createRole({ name: newRole });
      onClose();
    } catch (error) {
      console.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogContent
        className=" bg-light-900 flex h-auto w-[95%] max-w-3xl flex-col justify-items-center 
      gap-6  text-stone-900 dark:bg-stone-900 dark:text-white
      "
      >
        <div className=" mt-16 flex flex-col  gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="dark:bg-dark-200 w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none"
              placeholder=""
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row">
          <Button
            variant="hollow"
            className="order-2 w-full sm:order-1 sm:w-[130px]"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="purple"
            className="order-1 w-full sm:order-2 sm:w-[130px]"
            onClick={handleSave}
          >
            Create
          </Button>
        </DialogFooter>
        <div className="lef-0 border-black-200 absolute right-0 top-0 flex w-[100%] flex-row items-center justify-between gap-2 border-b-[1px] px-10 py-3">
          <DialogHeader className=" w-full ">
            <DialogTitle className=" text-left text-lg">
              Add New Role
            </DialogTitle>
          </DialogHeader>
          <button onClick={handleClose} className="">
            <IconClose className="h-5 invert dark:invert-0 " />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleModal;
