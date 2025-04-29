"use client";

import { FormEvent, useEffect, useState } from "react";
import { createNewBoard } from "@/app/home/kanban/actions";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useModal } from "@/hooks/use-modal";
import { Project } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

const BoardAddModal = () => {
  const supabase = createClientComponentClient();

  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "boardAddModal";

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("project").select();

      if (error) {
        if (error) throw error;
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
      }
    };

    if (isModalOpen) {
      fetchProjects();
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!projectId || !name) {
      toast.error("Please select a project and enter a board name.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("projectId", projectId);

      const response = await createNewBoard(formData);
      if (response.success) {
        toast.success("Create board successful.");
      } else {
        console.log(response.error);
        toast.error("Failed to create board.");
      }
    } catch (error) {
      console.log("Error create board modal: ", error);
      toast.error("Something went wrong!");
    } finally {
      onClose();
      setName("");
      setProjectId("");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="w-[90%] max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="relative">
            <DialogTitle className="mb-2 text-left text-lg">
              Add New Board
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label>Project</label>
              <Select name="projectId" onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Projects</SelectLabel>
                    {projects?.map((data) => (
                      <SelectItem key={data.id} value={data.id as string}>
                        {data.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Input
              id="name"
              type="text"
              label="Board Name"
              name="name"
              placeholder="Enter Board Name"
              className="dark:bg-dark-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

export default BoardAddModal;
