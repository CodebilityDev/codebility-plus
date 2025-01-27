import { ChangeEvent, useEffect, useState } from "react";
import {
  createProject,
  getProjectClients,
  getProjectCodevs,
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useModal } from "@/hooks/use-modal-projects";
import { Client, Codev } from "@/types/home/codev";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

const ProjectAddModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "projectAddModal";

  const [users, setUsers] = useState<Codev[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [codevsRes, clientsRes] = await Promise.all([
          getProjectCodevs(),
          getProjectClients(),
        ]);

        setUsers(codevsRes || []);
        setClients(clientsRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch initial data.");
      }
    };

    if (isModalOpen) {
      fetchData();
    }
  }, [isModalOpen]);

  const { register, handleSubmit, setValue, reset } = useForm({
    mode: "onChange",
  });

  const resetForm = () => {
    reset();
    setProjectImage(null);
    setSelectedMembers([]);
    onClose();
  };

  const handleUploadProjectThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);
      setProjectImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveProjectThumbnail = () => {
    setProjectImage(null);
  };

  const handleSubmitData = async (data: any) => {
    setIsLoading(true);

    try {
      const response = await createProject(data, selectedMembers);

      if (response.success) {
        toast.success("New Project has been added!");
        resetForm();
      } else {
        toast.error("Failed to create project.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="flex flex-col gap-4 overflow-y-auto lg:h-[45rem]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleSubmitData)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <div className="relative mx-auto flex size-[100px] md:mx-0 md:size-[80px]">
              {projectImage ? (
                <img
                  src={projectImage}
                  alt="Project Thumbnail"
                  className="rounded-full object-cover"
                />
              ) : (
                <DefaultAvatar size={100} />
              )}
            </div>
            <div className="flex flex-col justify-center gap-2">
              <label
                htmlFor="thumbnail"
                className="cursor-pointer text-blue-100"
              >
                Upload Image
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadProjectThumbnail}
              />
              {projectImage && (
                <p
                  className="text-violet cursor-pointer"
                  onClick={handleRemoveProjectThumbnail}
                >
                  Remove Image
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full space-y-3">
              <Input
                type="text"
                placeholder="Enter Project Name"
                {...register("project_name")}
              />
              <label>Client</label>
              <Select
                onValueChange={(value) => setValue("clientId", value)}
                name="clientId"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Add Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAddModal;
