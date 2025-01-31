import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  getProjectClients,
  getProjectCodevs,
  updateProject,
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { CustomSelect } from "@/Components/ui/CustomSelect";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { MemberSelection } from "@/Components/ui/MemberSelection";
import { useModal } from "@/hooks/use-modal-projects";
import { Client, Codev } from "@/types/home/codev";
import { deleteImage, getImagePath, uploadImage } from "@/utils/uploadImage";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";

const PROJECT_STATUSES = [
  { id: "pending", value: "pending", label: "Pending" },
  { id: "inprogress", value: "inprogress", label: "In Progress" },
  { id: "completed", value: "completed", label: "Completed" },
];

interface ProjectFormData {
  name: string;
  description?: string;
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  team_leader_id?: string;
  client_id?: string;
  status?: string;
  main_image?: string;
}

export interface UploadImageOptions {
  bucket?: string;
  folder?: string;
  cacheControl?: string;
  upsert?: boolean;
}

const ProjectEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "projectEditModal";

  const [users, setUsers] = useState<Codev[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>(
    data?.status || "active",
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    mode: "onChange",
  });

  // Watch team leader to filter members
  const currentTeamLeaderId = watch("team_leader_id");

  // Transform data for select options
  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
        subLabel: user.display_position,
        imageUrl: user.image_url,
      })),
    [users],
  );

  const clientOptions = useMemo(
    () =>
      clients.map((client) => ({
        id: client.id,
        value: client.id,
        label: client.name,
        subLabel: client.company_name,
        imageUrl: client.company_logo,
      })),
    [clients],
  );

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!isModalOpen) return;

      setIsDataLoading(true);
      try {
        const [codevsRes, clientsRes] = await Promise.all([
          getProjectCodevs(),
          getProjectClients(),
        ]);

        if (codevsRes) setUsers(codevsRes);
        if (clientsRes) setClients(clientsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [isModalOpen]);

  // Set initial form values
  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("description", data.description || "");
      setValue("github_link", data.github_link || "");
      setValue("website_url", data.website_url || "");
      setValue("figma_link", data.figma_link || "");
      setValue("team_leader_id", data.team_leader_id || "");
      setValue("client_id", data.client_id || "");
      setValue("status", data.status || "pending");
      setProjectImage(data.main_image || null);
      setSelectedStatus(data.status || "pending");

      // Set initial members if they exist
      if (
        data.members &&
        Array.isArray(data.members) &&
        data.members.length > 0
      ) {
        const initialMembers = users.filter((user) =>
          data.members?.includes(user.id),
        );
        setSelectedMembers(initialMembers);
      } else {
        setSelectedMembers([]); // Reset if no members
      }
    }
  }, [data, setValue, users]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create file name but don't pass it as an option
      const fileNameWithoutSpaces = file.name.replace(/\s+/g, "_");
      const { publicUrl } = await uploadImage(file, {
        bucket: "codebility",
        folder: `projectImage/${Date.now()}_${fileNameWithoutSpaces}`,
      });

      setProjectImage(publicUrl);
      setValue("main_image", publicUrl);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleRemoveImage = async () => {
    if (!projectImage) return;

    try {
      const imagePath = getImagePath(projectImage);
      if (imagePath) {
        await deleteImage(imagePath, "projectImage");
      }
      setProjectImage(null);
      setValue("main_image", undefined);
    } catch (error) {
      console.error("Failed to remove image:", error);
      toast.error("Failed to remove image");
    }
  };

  const onSubmit = async (formData: ProjectFormData) => {
    if (!data?.id) {
      toast.error("Project ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();

      // Ensure status is included and valid
      const validStatus = PROJECT_STATUSES.map((s) => s.value).includes(
        selectedStatus,
      )
        ? selectedStatus
        : "pending";

      // Add all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value);
        }
      });

      // Explicitly set status
      form.set("status", validStatus);

      // Add members
      const memberIds = selectedMembers.map((member) => member.id);
      form.append("members", JSON.stringify(memberIds));

      const response = await updateProject(data.id, form);

      if (response.success) {
        toast.success("Project updated successfully!");
        onClose();
      } else {
        toast.error(response.error || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div
          className="overflow-y-auto px-1"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                {projectImage ? (
                  <img
                    src={projectImage}
                    alt="Project"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100">
                    <DefaultAvatar size={64} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                  Upload Image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {projectImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Project Name"
                    {...register("name", {
                      required: "Project name is required",
                    })}
                    className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <Input
                  type="text"
                  placeholder="Project Description"
                  {...register("description")}
                  className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  type="text"
                  placeholder="GitHub Link"
                  {...register("github_link")}
                  className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                />
                <Input
                  type="text"
                  placeholder="Website URL"
                  {...register("website_url")}
                  className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  type="text"
                  placeholder="Figma Link"
                  {...register("figma_link")}
                  className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                />

                <CustomSelect
                  label="Status"
                  options={PROJECT_STATUSES}
                  value={selectedStatus} // Use controlled state
                  onChange={(value) => {
                    setSelectedStatus(value);
                    setValue("status", value);
                  }}
                  placeholder="Select Status"
                  variant="simple"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomSelect
                  label="Team Leader"
                  options={userOptions}
                  value={data?.team_leader_id}
                  onChange={(value) => setValue("team_leader_id", value)}
                  placeholder="Select Team Leader"
                />

                <CustomSelect
                  label="Client"
                  options={clientOptions}
                  value={data?.client_id}
                  onChange={(value) => setValue("client_id", value)}
                  placeholder="Select Client"
                />
              </div>

              {/* Team Members */}
              <MemberSelection
                users={users.filter((user) => user.id !== currentTeamLeaderId)}
                selectedMembers={selectedMembers}
                onMemberAdd={(member) =>
                  setSelectedMembers((prev) => [...prev, member])
                }
                onMemberRemove={(memberId) =>
                  setSelectedMembers((prev) =>
                    prev.filter((m) => m.id !== memberId),
                  )
                }
                excludeMembers={
                  currentTeamLeaderId ? [currentTeamLeaderId] : []
                }
              />
            </div>
          </form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="text-white"
          >
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;
