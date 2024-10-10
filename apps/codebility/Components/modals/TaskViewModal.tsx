"use client";

import Image from "next/image";
import { handleCopy } from "@/app/home/kanban/[id]/_lib";
import { DEFAULT_AVATAR } from "@/app/home/kanban/[id]/_lib/constants";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useModal } from "@/hooks/use-modal";
import { IconCopy } from "@/public/assets/svgs";
import { Ellipsis } from "lucide-react";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const TaskViewModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskViewModal";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="h-[32rem] w-[90%] max-w-3xl overflow-y-auto lg:h-[44rem]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <DialogHeader className="relative">
              <DialogTitle className="text-left text-lg font-bold capitalize">
                {data?.title}
              </DialogTitle>
            </DialogHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="dark:bg-black-200 w-56">
                <DropdownMenuItem
                  onClick={() => onOpen("taskEditModal", data)}
                  className="cursor-pointer"
                >
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpen("taskDeleteModal", data)}
                  className="cursor-pointer"
                >
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="title"
              type="text"
              label="Task Name"
              name="title"
              placeholder="Enter Task Name"
              className="dark:bg-dark-200 cursor-not-allowed"
              value={data?.title}
              disabled
            />
            <div className="flex flex-col justify-end">
              <label htmlFor="category">Category</label>
              <Select name="category" disabled>
                <SelectTrigger>
                  <SelectValue placeholder={data?.category}></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup></SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Input
              id="duration"
              type="number"
              label="Task Duration (in hrs)"
              name="duration"
              min="0"
              step="0.25"
              placeholder="Enter Task Duration"
              className="dark:bg-dark-200 cursor-not-allowed"
              value={data?.duration}
              disabled
            />
            <Input
              id="points"
              type="number"
              label="Points"
              name="points"
              min="0"
              placeholder="Enter Task Points"
              className="dark:bg-dark-200 cursor-not-allowed"
              value={data?.points}
              disabled
            />
            <div>
              <label htmlFor="priority">Priority Level</label>
              <Select name="priority" disabled>
                <SelectTrigger>
                  <SelectValue placeholder={data?.priority_level}></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup></SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <Select name="type" disabled>
                <SelectTrigger>
                  <SelectValue placeholder={data?.type}></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup></SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                id="branchName"
                type="text"
                label="Branch Name"
                name="branchName"
                className="dark:bg-dark-200 cursor-not-allowed"
                value={data?.pr_link}
                disabled
              />
              <button type="button" onClick={() => handleCopy(data.pr_link)}>
                <IconCopy className="h-5 invert dark:invert-0" />
              </button>
            </div>
            <Input
              id="pr_link"
              type="text"
              label="Pull Request Link"
              name="pr_link"
              className="dark:bg-dark-200 cursor-not-allowed"
              value={data?.pr_link}
              disabled
            />
          </div>
          <div className="flex flex-wrap items-center">
            {data?.codev_task &&
              data.codev_task.length > 0 &&
              data?.codev_task.map((codev: any) => {
                return (
                  <div
                    className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                    key={codev.id}
                  >
                    <Image
                      alt="Avatar"
                      src={codev.codev.user.profile.image_url || DEFAULT_AVATAR}
                      fill
                      title={`${codev.codev.first_name} ${codev.codev.last_name}'s avatar`}
                      className="h-auto w-full rounded-full bg-cover object-cover"
                      loading="eager"
                    />
                  </div>
                );
              })}
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <Textarea
              id="desc"
              variant="ghost"
              name="description"
              className="dark:bg-dark-200 h-[8rem] cursor-not-allowed resize-none text-sm"
              placeholder="Add a more detailed description..."
              value={data?.description}
              disabled
            />
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
