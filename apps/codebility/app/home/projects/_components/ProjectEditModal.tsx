"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  getProjectCategories,
  getProjectClients,
  getProjectCodevs,
  updateProject,
} from "@/app/home/projects/actions";
import ProjectAvatar from "../components/ProjectAvatar";
import { CustomSelect } from "../components/ui/CustomSelect";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { MemberSelection } from "../components/ui/MemberSelection";
import { Skeleton } from "../components/ui/skeleton/skeleton";
import { useModal } from "@/hooks/use-modal-projects";
import { Client, Codev, Project, SkillCategory } from "@/types/home/codev";
import { uploadImage } from "@/utils/uploadImage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";

// Dynamically import the ImageCrop component with no SSR
const ImageCrop = dynamic(() => import("./ImageCrop"), {
  ssr: false,
  loading: () => <Skeleton className="h-48 w-full rounded-lg" />,
});

// Define the available project statuses.
const PROJECT_STATUSES = [
  { id: "pending", value: "pending", label: "Pending" },
  { id: "inprogress", value: "inprogress", label: "In Progress" },
  { id: "completed", value: "completed", label: "Completed" },
];

export interface ProjectFormData {
  name: string;
  description?: string;
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  start_date: string;
  project_category_id?: string;
  client_id?: string;
  status?: string;
  main_image?: string;
}

const ProjectEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "projectEditModal";
  const queryClient = useQueryClient();

  // Data states
  const [currentTeamLeader, setCurrentTeamLeader] = useState<Codev | null>(
    null,
  );
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);

  // Image states with optimized loading
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // Controlled status state
  const [selectedStatus, setSelectedStatus] = useState<string>(
    data?.status || "pending",
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({ mode: "onChange" });

  // Fetch users data with React Query
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["projectCodevs"],
    queryFn: async () => {
      const result = await getProjectCodevs();
      return result || [];
    },
    enabled: isModalOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch clients data with React Query
  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ["projectClients"],
    queryFn: async () => {
      const result = await getProjectClients();
      return result || [];
    },
    enabled: isModalOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Fetch categories data with React Query
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["projectCategories"],
    queryFn: async () => {
      const result = await getProjectCategories();
      return result || [];
    },
    enabled: isModalOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isDataLoading =
    isUsersLoading || isClientsLoading || isCategoriesLoading;

  // Prepare select options using useMemo
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
        subLabel: client.name,
        imageUrl: client.company_logo,
      })),
    [clients],
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id.toString(),
        value: category.id.toString(),
        label: category.name,
        subLabel: category.description,
      })),
    [categories],
  );

  // When project data is available, set initial form values
  useEffect(() => {
    if (data && users.length > 0) {
      // Reset image loading state
      setImageLoaded(false);

      // Set form values
      setValue("name", data.name);
      setValue("description", data.description || "");
      setValue("github_link", data.github_link || "");
      setValue("website_url", data.website_url || "");
      setValue("figma_link", data.figma_link || "");
      setValue("client_id", data.client_id || "");
      setValue(
        "project_category_id",
        data.project_category_id ? data.project_category_id.toString() : "",
      );
      setValue("status", data.status || "pending");
      if (data.start_date) {
        setValue("start_date", data.start_date);
      }
      setProjectImage(data.main_image || null);
      setCroppedImage(data.main_image || null);
      setSelectedStatus(data.status || "pending");

      // Initialize project members and team leader from project_members
      if (data.project_members && data.project_members.length > 0) {
        // Find team leader
        const teamLeaderMember = data.project_members.find(
          (pm) => pm.role === "team_leader",
        );
        if (teamLeaderMember) {
          const leader = users.find(
            (user) => user.id === teamLeaderMember.codev_id,
          );
          if (leader) {
            setCurrentTeamLeader(leader);
          }
        }

        // Find regular members
        const memberIds = data.project_members
          .filter((pm) => pm.role === "member")
          .map((pm) => pm.codev_id);

        const memberCodevs = users.filter((user) =>
          memberIds.includes(user.id),
        );

        setSelectedMembers(memberCodevs);
      }
    }
  }, [data, setValue, users]);

  // Handler for image change with optimized loading
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setImageLoaded(false);
      const file = e.target.files?.[0];
      if (!file) return;

      // Use createObjectURL for faster preview
      const objectUrl = URL.createObjectURL(file);
      setProjectImage(objectUrl);
      setCroppedImage(objectUrl);
      setCroppedFile(file);
      setOpenImageCropper(true);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    }
  };

  // Handler for image removal
  const handleRemoveImage = () => {
    setProjectImage(null);
    setValue("main_image", undefined);
    setCroppedImage(null);
    setCroppedFile(null);
    setImageLoaded(false);
  };

  const resetForm = () => {
    reset();
    setProjectImage(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setSelectedMembers([]);
    setCurrentTeamLeader(null);
    setImageLoaded(false);
    onClose();
  };

  // Subcomponent: ImageUploadSection with optimized loading
  const ImageUploadSection = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        {croppedImage ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <Skeleton className="h-full w-full" />
              </div>
            )}
            <Image
              src={croppedImage}
              alt="Project"
              className={`h-full w-full cursor-pointer object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpenImageCropper(true)}
              width={408}
              height={192}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <ProjectAvatar size={64} />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <label
          htmlFor="image-upload"
          className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 dark:text-white dark:hover:text-blue-100"
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
        {openImageCropper && (
          <ImageCrop
            image={projectImage || ""}
            setImage={setCroppedImage}
            setFile={setCroppedFile}
            open={openImageCropper}
            setOpen={setOpenImageCropper}
          />
        )}
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
  );

  // Subcomponent: ProjectDetailsSection
  const ProjectDetailsSection = () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Name</label>
        <Input
          type="text"
          placeholder="Enter project name"
          {...register("name", { required: "Project name is required" })}
          className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Description</label>
        <Input
          type="text"
          placeholder="Enter project description"
          {...register("description")}
          className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">GitHub Link (optional)</label>
          <Input
            type="text"
            placeholder="Enter GitHub link"
            {...register("github_link")}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Website URL (optional)</label>
          <Input
            type="text"
            placeholder="Enter website URL"
            {...register("website_url")}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Figma Link (optional)</label>
          <Input
            type="text"
            placeholder="Enter Figma link"
            {...register("figma_link")}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            placeholder="Select start date"
            {...register("start_date", { required: "Start date is required" })}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          />
          {errors.start_date && (
            <p className="text-sm text-red-500">{errors.start_date.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Subcomponent: SelectSection
  const SelectSection = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CustomSelect
        label="Team Leader"
        options={userOptions.filter(
          (user) => !selectedMembers.find((member) => member.id === user.value),
        )}
        value={currentTeamLeader?.id || ""}
        onChange={(value) => {
          const leader = users.find((u) => u.id === value);
          if (leader) setCurrentTeamLeader(leader);
        }}
        placeholder="Select Team Leader"
        disabled={isDataLoading}
        searchable
      />
      <CustomSelect
        label="Project Category"
        options={categoryOptions}
        onChange={(value) => setValue("project_category_id", value)}
        value={data?.project_category_id?.toString() || ""}
        placeholder="Select Project Category"
        variant="simple"
        searchable
      />
      <CustomSelect
        label="Client"
        options={clientOptions}
        onChange={(value) => setValue("client_id", value)}
        value={data?.client_id || ""}
        placeholder="Select Client"
        disabled={isDataLoading}
        searchable
      />
      <CustomSelect
        label="Status"
        options={PROJECT_STATUSES}
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
        placeholder="Select Status"
        variant="simple"
      />
      <div className="md:col-span-2">
        <MemberSelection
          users={users.filter((user) => user.id !== currentTeamLeader?.id)}
          selectedMembers={selectedMembers}
          onMemberAdd={(member) =>
            setSelectedMembers((prev) => [...prev, member])
          }
          onMemberRemove={(memberId) =>
            setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId))
          }
          excludeMembers={currentTeamLeader ? [currentTeamLeader.id] : []}
        />
      </div>
    </div>
  );

  const onSubmit = async (formData: ProjectFormData) => {
    if (!data?.id) {
      toast.error("Project ID is missing");
      return;
    }

    if (!currentTeamLeader) {
      toast.error("Team leader is required");
      return;
    }

    if (!formData.client_id) {
      toast.error("Client is required");
      return;
    }

    if (!formData.project_category_id) {
      toast.error("Project category is required");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();

      // Handle image upload if there's a new cropped file
      if (croppedFile) {
        console.log("Uploading new image");
        const publicUrl = await uploadImage(croppedFile, {
          bucket: "codebility",
          folder: `projectImage/${Date.now()}_${croppedFile.name.replace(/\s+/g, "_")}`,
        });

        if (!publicUrl) {
          throw new Error("Failed to upload image");
        }

        // Set the new image URL
        console.log("Setting new main_image:", publicUrl);
        form.append("main_image", publicUrl);
      } else if (data.main_image && croppedImage) {
        // If using existing image without changes
        console.log("Keeping existing image:", data.main_image);
        form.append("main_image", data.main_image);
      }

      // Add form data - make sure we add all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "main_image") {
          form.append(key, value);
        }
      });

      // Add status
      form.set("status", selectedStatus);

      // Prepare project members with roles
      const projectMembers = [
        // Add team leader
        {
          codev_id: currentTeamLeader.id,
          role: "team_leader",
        },
        // Add other members
        ...selectedMembers.map((member) => ({
          codev_id: member.id,
          role: "member",
        })),
      ];

      form.append("project_members", JSON.stringify(projectMembers));

      console.log("Form data before submission:");
      // Log the form data to verify all fields are included
      for (let [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await updateProject(data.id, form);
      if (response.success) {
        // Invalidate queries to refresh data across components
        queryClient.invalidateQueries({ queryKey: ["teamLead", data.id] });
        queryClient.invalidateQueries({ queryKey: ["members", data.id] });

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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="px-1" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {isDataLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <ImageUploadSection />
              <ProjectDetailsSection />
              <SelectSection />
            </form>
          )}
          <DialogFooter className="pb-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose()}
              className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isDataLoading}
              onClick={handleSubmit(onSubmit)}
              className="text-white"
            >
              {isLoading ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;
