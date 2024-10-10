"use client";

import { useRouter } from "next/navigation";
import { useFetchEnum } from "@/app/home/_hooks/supabase/use-fetch-enum";
import KanbanTaskAddModalMembers from "@/app/home/kanban/[id]/_components/kanban_modals/kanban-add-modal-members";
import { createNewTask } from "@/app/home/kanban/[id]/actions";
import { Button } from "@/Components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { taskPrioLevels, taskTypes } from "@/constants";
import { useModal } from "@/hooks/use-modal";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const TaskAddModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskAddModal";

  const { data: categories } = useFetchEnum("public", "taskcategory");
  const router = useRouter();

  const validateInput = (formData: FormData) => {
    const inputs: Record<string, any> = {};

    // get all input name and value as key: value pair.
    for (let [key, value] of formData.entries()) inputs[key] = value;

    const required = ["title", "category", "priority", "type"];

    for (let key of formData.keys()) {
      const value = inputs[key];

      // check if required input has value.
      if (
        required.includes(key) &&
        (value === null || value === undefined || value === "")
      )
        throw new Error(`${key} is required`);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      validateInput(formData);

      const response = await createNewTask(formData);
      if (response.success) {
        toast.success("Create task successful.");
        router.refresh(); // show new task.
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
      <DialogContent className="h-[32rem] w-[90%] max-w-3xl overflow-y-auto lg:h-auto">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="relative">
            <DialogTitle className="text-left text-lg">
              Add New Task
            </DialogTitle>
          </DialogHeader>
          <Label>
            in list:{" "}
            <span className="text-yellow-500 underline">{data?.listName}</span>
          </Label>
          <input type="hidden" name="projectId" value={data?.projectId} />
          <input type="hidden" name="listId" value={data?.listId} />
          <input type="hidden" name="totalTask" value={data?.totalTask} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="title"
              type="text"
              label="Task Name"
              name="title"
              placeholder="Enter Task Name"
              className="dark:bg-dark-200"
            />
            <div className="flex flex-col justify-end">
              <label htmlFor="category">Category</label>
              <Select name="category">
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
            />
            <Input
              id="points"
              type="number"
              label="Points"
              name="points"
              min="0"
              placeholder="Enter Task Points"
              className="dark:bg-dark-200"
            />
            <div>
              <label htmlFor="priority">Priority Level</label>
              <Select name="priority">
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
              <Select name="type">
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
          </div>
          <KanbanTaskAddModalMembers />
          <div>
            <label htmlFor="desc">Description</label>
            <Textarea
              id="desc"
              variant="ghost"
              name="description"
              className="dark:bg-dark-200 h-[8rem] resize-none text-sm"
              placeholder="Add a more detailed description..."
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

export default TaskAddModal;
