import { ChangeEvent, useEffect, useState } from "react";
import {
  getProjectClients,
  getProjectCodevs,
  updateProject,
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useModal } from "@/hooks/use-modal-projects";
import { Client, Codev } from "@/types/home/codev";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

const PROJECT_STATUSES = ["pending", "inprogress", "completed"];

const ProjectEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "projectEditModal";

  const [users, setUsers] = useState<Codev[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [codevs, clients] = await Promise.all([
          getProjectCodevs({ filters: { application_status: "ACCEPTED" } }),
          getProjectClients(),
        ]);

        setUsers(codevs || []);
        setClients(clients || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch initial data.");
      }
    };

    if (isModalOpen) {
      fetchInitialData();
    }
  }, [isModalOpen, data?.members]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name || "");
      setValue("description", data.description || "");
      setValue("client_id", data.client_id || "");
      setValue("team_leader_id", data.team_leader_id || "");
      setValue("status", data.status || "pending");
      setValue("github_link", data.github_link || "");
      setValue("website_url", data.website_url || "");
      setValue("figma_link", data.figma_link || "");
      setProjectImage(data.main_image || null);
    }
  }, [data]);

  const handleUploadProjectThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("main_image", file);
      setProjectImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveProjectThumbnail = () => {
    setValue("main_image", null);
    setProjectImage(null);
  };

  const handleSubmitData = async (formData: any) => {
    setIsLoading(true);

    if (!data?.id) {
      toast.error("Project ID is missing. Cannot update project.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await updateProject(data.id, formData);
      if (response.success) {
        toast.success("Project updated successfully!");
        onClose();
      } else {
        toast.error(response.error || "Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-5 overflow-y-auto lg:h-[45rem] lg:justify-between lg:overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleSubmitData)}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-4">
            <div className="relative flex items-center justify-center">
              {projectImage ? (
                <img
                  src={projectImage}
                  alt="Project Thumbnail"
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <DefaultAvatar size={96} />
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
                  className="cursor-pointer text-red-500"
                  onClick={handleRemoveProjectThumbnail}
                >
                  Remove Image
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Input
                label="Project Name"
                placeholder="Enter project name"
                {...register("name")}
              />
              <Input
                label="Description"
                placeholder="Enter project description"
                {...register("description")}
              />
              <Select
                onValueChange={(value) => setValue("client_id", value)}
                defaultValue={data?.client_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Clients</SelectLabel>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                onValueChange={(value) => setValue("status", value)}
                defaultValue={data?.status || "pending"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Project Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => setValue("team_leader_id", value)}
                defaultValue={data?.team_leader_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Team Leader" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {`${user.first_name} ${user.last_name}`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Input
            label="GitHub Link"
            placeholder="Enter GitHub link"
            {...register("github_link")}
          />
          <Input
            label="Website URL"
            placeholder="Enter website URL"
            {...register("website_url")}
          />
          <Input
            label="Figma Link"
            placeholder="Enter Figma link"
            {...register("figma_link")}
          />

          <DialogFooter className="flex justify-between">
            <Button type="button" variant="hollow" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;
