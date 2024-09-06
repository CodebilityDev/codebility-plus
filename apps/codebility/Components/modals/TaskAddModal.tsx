"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createTaskonList } from "@/app/api/kanban";
import { Button } from "@/Components/ui/button";
import Input from "@/Components/ui/forms/input";
import { categories, taskPrioLevels, taskTypes } from "@/constants";
import { useModal } from "@/hooks/use-modal";
import useToken from "@/hooks/use-token";
import { API } from "@/lib/constants";
import { IconClose, IconDropdown, IconPlus } from "@/public/assets/svgs";
import { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import axios from "axios";
import toast from "react-hot-toast";

import { Dialog, DialogContent, DialogFooter } from "@codevs/ui/dialog";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

interface AddedMember {
  id?: string;
  image_url?: string | null;
  last_name?: string;
  first_name?: string;
}

interface inputTask {
  // id: string
  selectedPrioLevel: string | null;
  selectedCategory: string | null;
  selectedType: string | null;
  title: string;
  description: string;
  duration: number;
  points: number;
  addedMembers: AddedMember[];
}

const TaskAddModal = () => {
  const { isOpen, onClose, type, data, dataObject } = useModal();
  const [inputTask, setInputTask] = useState<inputTask>({
    selectedPrioLevel: null,
    selectedCategory: null,
    selectedType: null,
    title: "",
    description: "",
    duration: 0,
    points: 0,
    addedMembers: [],
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const { token } = useToken();
  const projectId = data;

  const addMember = (member: User) => {
    setSelectedMembers((prevMembers) => [...prevMembers, member]);
    setInputTask((prevInputTask) => ({
      ...prevInputTask,
      addedMembers: [...prevInputTask.addedMembers, member],
    }));
  };

  const removeMember = (id: string) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id),
    );
    setInputTask((prevInputTask) => ({
      ...prevInputTask,
      addedMembers: prevInputTask.addedMembers.filter(
        (member) => member.id !== id,
      ),
    }));
  };

  const handleTitleChange = (e: any) => {
    setInputTask({ ...inputTask, title: e.target.value });
  };

  const handleDurationChange = (e: any) => {
    e.preventDefault();
    setInputTask({ ...inputTask, duration: e.target.value });
  };

  const handlePointsChange = (e: any) => {
    e.preventDefault();
    setInputTask({ ...inputTask, points: e.target.value });
  };

  const handleChangeDescription = (e: any) => {
    setInputTask({ ...inputTask, description: e.target.value });
  };

  const handleSave = async () => {
    if (inputTask.title === "") {
      toast.error("Title is Empty");
      return;
    }
    if (inputTask.description === "") {
      toast.error("Description is Empty");
      return;
    }
    if (!inputTask.selectedPrioLevel) {
      toast.error("Prio Level is not set");
      return;
    }
    if (isNaN(Number(inputTask.duration)) || Number(inputTask.duration) <= 0) {
      toast.error("Invalid duration");
      return;
    }

    const listId = dataObject?.listId;

    let updatedData = {
      title: inputTask.title,
      task_type: inputTask.selectedType,
      task_points: Number(inputTask.points),
      prio_level: inputTask.selectedPrioLevel?.toUpperCase(),
      duration: Number(inputTask.duration),
      task_category: inputTask.selectedCategory,
      full_description: inputTask.description,
      userTaskId: selectedMembers.map((member) => ({ id: member.id })),
      projectId: projectId,
      listId: listId,
    };

    try {
      const response = await createTaskonList(updatedData, token, listId);

      if (response.status == 201) {
        onClose();
        toast.success("Tasks Added");
        setInputTask({ ...inputTask, addedMembers: [] });
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleClose = () => {
    setInputTask({ ...inputTask, addedMembers: [], duration: 0, points: 0 });
    onClose();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios(API.USERS);
        if (!response) {
          throw new Error("Failed to fetch data from the server.");
        }
        setMembers(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const isModalOpen = isOpen && type === "taskAddModal";

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="background-lightsection_darksection flex h-[32rem] w-full max-w-3xl flex-col justify-items-center gap-6 overflow-x-auto overflow-y-auto lg:h-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Task Name</Label>
            <Input
              id="title"
              onChange={handleTitleChange}
              className="border-light_dark dark:bg-dark-200 w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none"
              placeholder="Enter Task Name"
            />
            <div className="flex gap-1">
              <Label>in list</Label>
              {/* <Label className="underline">{dataObject?.name}</Label> */}
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-1/2 gap-4">
              <div className="flex w-1/3 flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) =>
                    setInputTask({ ...inputTask, selectedCategory: value })
                  }
                >
                  <SelectTrigger
                    aria-label="Category"
                    className="border-light_dark dark:bg-dark-200 flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none"
                  >
                    <SelectValue className="text-sm">
                      {inputTask.selectedCategory}
                    </SelectValue>
                    <IconDropdown className="h-5 invert dark:invert-0" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="border-light_dark dark:bg-black-100 z-10 rounded-md border bg-[#FFF]"
                  >
                    <SelectGroup>
                      {categories.map((category, i) => (
                        <SelectItem
                          key={i}
                          className="cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-1/3 flex-col gap-2">
                <Label htmlFor="duration">Duration hrs</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.25"
                  value={inputTask.duration}
                  isKeyboard={true}
                  onChange={handleDurationChange}
                  className="border-light_dark dark:bg-dark-200 w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div className="flex w-1/3 flex-col gap-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={inputTask.points}
                  onChange={handlePointsChange}
                  className="border-light_dark dark:bg-dark-200 w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex w-1/2 gap-4">
              <div className="flex w-1/2 flex-col gap-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  onValueChange={(value) =>
                    setInputTask({ ...inputTask, selectedPrioLevel: value })
                  }
                >
                  <SelectTrigger
                    aria-label="Priority Level"
                    className="border-light_dark dark:bg-dark-200 flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none"
                  >
                    <SelectValue className="text-sm">
                      {inputTask.selectedPrioLevel}
                    </SelectValue>
                    <IconDropdown className="h-5 invert dark:invert-0" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="border-light_dark dark:bg-black-100 z-10 rounded-md border bg-[#FFF]"
                  >
                    <SelectGroup>
                      {taskPrioLevels.map((prioLevel, i) => (
                        <SelectItem
                          key={i}
                          className="cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                          value={prioLevel}
                        >
                          {prioLevel}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  onValueChange={(value) =>
                    setInputTask({ ...inputTask, selectedType: value })
                  }
                >
                  <SelectTrigger
                    aria-label="Type"
                    className="border-light_dark dark:bg-dark-200 flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none"
                  >
                    <SelectValue className="text-sm">
                      {inputTask.selectedType}
                    </SelectValue>
                    <IconDropdown className="h-5 invert dark:invert-0" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="border-light_dark dark:bg-black-100 z-10 rounded-md border bg-[#FFF]"
                  >
                    <SelectGroup>
                      {taskTypes.map((type, i) => (
                        <SelectItem
                          key={i}
                          className="cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                          value={type}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="members">Members</label>
            <div className="flex gap-2">
              <div className="flex flex-wrap items-center">
                {selectedMembers.map((member, index) => (
                  <div
                    className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                    key={`${member.id}_${index}`}
                    onClick={() => removeMember(member.id)}
                  >
                    <Image
                      alt="Avatar"
                      src={member.image_url ?? "/default-avatar.jpg"}
                      fill
                      title={`${member.id}'s Avatar`}
                      className="h-auto w-full rounded-full bg-cover object-cover"
                      loading="eager"
                    />
                  </div>
                ))}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Button
                    variant="hollow"
                    className="h-12 w-12 rounded-full p-0"
                  >
                    <IconPlus className="invert dark:invert-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  sideOffset={10}
                  align="start"
                  className="dark:bg-dark-100 z-10 max-h-[200px] overflow-y-auto rounded-lg bg-white"
                >
                  <DropdownMenuLabel className="pb-2 text-center text-sm">
                    Add Members
                  </DropdownMenuLabel>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search members"
                    className="dark:bg-dark-200 mb-2 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none"
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="px-4 py-2 text-xs">
                    Available Members
                  </DropdownMenuLabel>
                  {members
                    ?.filter((user) =>
                      `${user.first_name} ${user.last_name}`
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )
                    .map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        className="dark:hover:bg-dark-200 flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                        onClick={() => addMember(user)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                            <Image
                              alt="Avatar"
                              src={user.image_url ?? "/default-avatar.jpg"}
                              fill
                              title={`${user.id}'s Avatar`}
                              className="h-auto w-full rounded-full bg-cover object-cover"
                              loading="eager"
                            />
                          </div>
                          <span>{`${user.first_name} ${user.last_name}`}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              variant="ghost"
              onChange={handleChangeDescription}
              className="dark:bg-dark-200 h-[8rem] resize-none text-sm"
              placeholder="Add a more detailed description..."
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row">
          <Button
            variant="default"
            className="order-1 w-full sm:order-2 sm:w-[130px]"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
        <div>
          <button onClick={handleClose} className="absolute right-4 top-4">
            <IconClose className="h-5 invert dark:invert-0" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAddModal;
