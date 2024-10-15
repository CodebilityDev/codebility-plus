"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFetchMembers } from "@/app/home/kanban/[id]/_hooks/use-fetch-members";
import { handleCopy } from "@/app/home/kanban/[id]/_lib";
import { DEFAULT_AVATAR } from "@/app/home/kanban/[id]/_lib/constants";
import { Member } from "@/app/home/kanban/[id]/_types/member";
import { updateTask } from "@/app/home/kanban/[id]/actions";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { categories, taskPrioLevels, taskTypes } from "@/constants";
import { useModal } from "@/hooks/use-modal";
import { IconCopy, IconPlus } from "@/public/assets/svgs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

const TaskEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskEditModal";

  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [points, setPoints] = useState("");
  const [priority, setPriority] = useState("");
  const [taskType, setTaskType] = useState("");
  const [prLink, setPrLink] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Member[] | any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: members } = useFetchMembers();

  const editTaskNumber = isModalOpen ? data.number : 0;
  const editTaskTitle = isModalOpen ? taskTitle.split(" ").join("-") : "";
  const editBranchName = `${editTaskNumber}-${editTaskTitle}`;

  useEffect(() => {
    if (data && isModalOpen) {
      setTaskTitle(data.title);
      setCategory(data.category || "");
      setDuration(data.duration || "");
      setPoints(data.points || "");
      setPriority(data.priority_level || "");
      setTaskType(data.type || "");
      setPrLink(data.pr_link || "");
      setDescription(data.description || "");
      setSelectedMembers(data.codev_task || []);
    }
  }, [isModalOpen]);

  const addMember = (member: Member) => {
    setSelectedMembers((prevMembers) => {
      if (prevMembers.some((prevMember) => prevMember.id === member.id))
        return prevMembers;
      return [...prevMembers, member];
    });
  };

  const removeMember = (id: string) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id),
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", taskTitle);
      formData.append("category", category);
      formData.append("duration", duration);
      formData.append("points", points);
      formData.append("priority", priority);
      formData.append("type", taskType);
      formData.append("pr_link", prLink);
      formData.append("description", description);

      const response = await updateTask(formData, data);
      if (response.success) {
        toast.success("Create task successful.");
        router.refresh();
      } else {
        console.log("Error creating task: ", response.error);
        toast.error("Failed to create task.");
      }
    } catch (error) {
      console.log("Error creating task: ", error);
      toast.error("Something went wrong.");
    } finally {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        aria-describedby={undefined}
        className="h-[32rem] w-[90%] max-w-3xl overflow-y-auto lg:h-[44rem]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="relative max-w-[17.5rem] md:max-w-xl lg:max-w-[39rem] ">
            <DialogTitle className="text-left text-lg font-bold capitalize break-words">
              Edit Task: {data?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="title"
              type="text"
              label="Task Name"
              name="title"
              placeholder="Enter Task Name"
              className="dark:bg-dark-200"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <div className="flex flex-col justify-end">
              <label htmlFor="category">Category</label>
              <Select
                name="category"
                onValueChange={setCategory}
                defaultValue={category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories?.map((category: string, i: number) => (
                      <SelectItem key={i} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
              className="dark:bg-dark-200"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Input
              id="points"
              type="number"
              label="Points"
              name="points"
              min="0"
              placeholder="Enter Task Points"
              className="dark:bg-dark-200"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
            />
            <div>
              <label htmlFor="priority">Priority Level</label>
              <Select
                name="priority"
                onValueChange={setPriority}
                defaultValue={priority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority Level"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {taskPrioLevels.map((prioLevel, i) => (
                      <SelectItem key={i} value={prioLevel}>
                        {prioLevel}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <Select
                name="type"
                onValueChange={setTaskType}
                defaultValue={taskType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {taskTypes.map((type, i) => (
                      <SelectItem key={i} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
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
                value={editBranchName}
                disabled
              />
              <button type="button" onClick={() => handleCopy(editBranchName)}>
                <IconCopy className="h-5 invert dark:invert-0" />
              </button>
            </div>
            <Input
              id="pr_link"
              type="text"
              label="Pull Request Link"
              name="pr_link"
              className="dark:bg-dark-200"
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="members">Members</label>
            <input
              type="hidden"
              name="membersId"
              value={selectedMembers.map((member) => member.id)}
            />
            {/* note: not working yung update task sa member */}
            <div className="flex gap-2">
              <div className="flex flex-wrap items-center">
                {selectedMembers.map((member) => {
                  return (
                    <div
                      className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                      key={member.codev.id}
                      onClick={() => removeMember(member.id)}
                    >
                      <Image
                        alt="Avatar"
                        src={
                          member.codev.user.profile.image_url || DEFAULT_AVATAR
                        }
                        fill
                        title={`${member.codev.user.profile.first_name} ${member.codev.user.profile.last_name}'s avatar`}
                        className="h-auto w-full rounded-full bg-cover object-cover"
                        loading="eager"
                      />
                    </div>
                  );
                })}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer" asChild>
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
                              src={user.image_url || DEFAULT_AVATAR}
                              fill
                              title={`${user.id}'s Avatar`}
                              className="h-auto w-full rounded-full bg-cover object-cover"
                              loading="eager"
                            />
                          </div>
                          <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div>
            <label htmlFor="desc">Description</label>
            <Textarea
              id="desc"
              variant="ghost"
              name="description"
              className="dark:bg-dark-200 h-[8rem] resize-none text-sm"
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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

export default TaskEditModal;
