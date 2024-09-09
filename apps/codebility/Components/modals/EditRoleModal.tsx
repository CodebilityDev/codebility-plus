"use client";

import React, { useEffect, useState } from "react";
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
} from "@codevs/ui/dialog";
import { Label } from "@codevs/ui/label";

const EditRoleModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editRoleModal";

  const [editedRole, setEditedRole] = useState<string | undefined>("");

  useEffect(() => {
    if (isModalOpen && data !== undefined) setEditedRole(data);
  }, [isModalOpen, data]);

  const handleChangeRole = (e: any) => {
    setEditedRole(e.target.value);
  };

  const handleClose = () => {
    setEditedRole("");
    onClose();
  };

  const handleSave = () => {
    if (!editedRole) return toast.error("Name is Empty");
    toast.success(`${editedRole} role successfully edited!`);
    onClose();
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="background-lightsection_darksection flex h-auto w-[95%] max-w-3xl flex-col justify-items-center gap-6 ">
        <div className=" mt-16 flex flex-col  gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={editedRole}
              onChange={handleChangeRole}
              className="border-light_dark dark:bg-dark-200 w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none"
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
            Save
          </Button>
        </DialogFooter>
        <div className="lef-0 border-black-200 absolute right-0 top-0 flex w-[100%] flex-row items-center justify-between gap-2 border-b-[1px] px-10 py-3">
          <DialogHeader className=" w-full ">
            <DialogTitle className=" text-left text-lg">
              Edit {data} Role
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

export default EditRoleModal;
