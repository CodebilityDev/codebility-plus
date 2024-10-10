"use client";

import { FormEvent, useState } from "react";
import { createNewList } from "@/app/home/kanban/[id]/actions";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const ListAddModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "listAddModal";

  const [listName, setListName] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!listName) {
      toast.error("Please enter a list name.");
      return;
    }

    try {
      const response = await createNewList(listName, data);
      if (response.success) {
        toast.success("Create list successful.");
      } else {
        console.log(response.error);
        toast.error("Failed to create list.");
      }
    } catch (error) {
      console.log("Error create list modal: ", error);
      toast.error("Something went wrong!");
    } finally {
      onClose();
      setListName("");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="relative">
            <DialogTitle className="mb-2 text-left text-lg">
              Add New List
            </DialogTitle>
          </DialogHeader>
          <Input
            id="name"
            type="text"
            label="List Name"
            name="name"
            placeholder="Enter List Name"
            className="dark:bg-dark-200"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
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
              type="submit"
              variant="default"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListAddModal;
