"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  getProjectCategories,
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
import { Client, Codev, Project, SkillCategory } from "@/types/home/codev";
import { uploadImage } from "@/utils/uploadImage";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";

import ImageCrop from "./ImageCrop";

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

  // Data states
  const [users, setUsers] = useState<Codev[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  // Image states
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  // Member selection state
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  console.log(" selectedMembers:", selectedMembers);
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  // Controlled status state
  const [selectedStatus, setSelectedStatus] = useState<string>(
    data?.status || "pending",
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({ mode: "onChange" });

  // Use the controlled value for team leader (and others) via watch.
  const [currentTeamLeader, setCurrentTeamLeader] = useState<Codev | null>(
    null,
  );

  // Prepare select options using useMemo.
  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        value: user.id,
        label: `${user.first_name} ${user.last_name}`, // Fixed template literal
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

  // Fetch initial data for users, clients, and categories.
  useEffect(() => {
    const fetchData = async () => {
      if (!isModalOpen) return;
      setIsDataLoading(true);
      try {
        const [codevsRes, clientsRes, categoriesRes] = await Promise.all([
          getProjectCodevs(),
          getProjectClients(),
          getProjectCategories(),
        ]);
        if (codevsRes) setUsers(codevsRes);
        if (clientsRes) setClients(clientsRes);
        if (categoriesRes) setCategories(categoriesRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, [isModalOpen]);

  // When project data is available, set initial form values.
  useEffect(() => {
    if (data && users.length > 0) {
      // Check if both data and users are available
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
  }, [data, setValue, users]); // Keep all dependencies
  // Handler for image change.
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
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

  // Handler for image removal.
  const handleRemoveImage = async () => {
    try {
      if (!projectImage) return;
      setProjectImage(null);
      setValue("main_image", undefined);
      setCroppedImage(null);
      setCroppedFile(null);
    } catch (error) {
      console.error("Failed to remove image:", error);
      toast.error("Failed to remove image");
    }
  };

  const resetForm = () => {
    reset();
    setProjectImage(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setSelectedMembers([]);
    onClose();
  };

  // --- Subcomponents ---

  // ImageUploadSection: Handles image upload, cropping and removal.
  const ImageUploadSection = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {croppedImage ? (
          <Image
            src={croppedImage}
            alt="Project"
            className="h-full w-full cursor-pointer object-cover"
            onClick={() => setOpenImageCropper(true)}
            width={408}
            height={192}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <DefaultAvatar size={64} />
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
        <ImageCrop
          image={projectImage || ""}
          setImage={setCroppedImage}
          setFile={setCroppedFile}
          open={openImageCropper}
          setOpen={setOpenImageCropper}
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
  );

  // ProjectDetailsSection: Renders text inputs with labels.
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
          <label className="text-sm font-medium">GitHub Link</label>
          <Input
            type="text"
            placeholder="Enter GitHub link"
            {...register("github_link")}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Website URL</label>
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
          <label className="text-sm font-medium">Figma Link</label>
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

  // SelectSection: Renders dropdowns and member selection.
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
      {/* ... other select components ... */}
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

      // Handle image upload if changed
      if (projectImage !== croppedImage && croppedFile) {
        const { publicUrl } = await uploadImage(croppedFile, {
          bucket: "codebility",
          folder: `projectImage/${Date.now()}_${croppedFile.name}`,
        });
        form.append("main_image", publicUrl);
      }

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="px-1" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ImageUploadSection />
            <ProjectDetailsSection />
            <SelectSection />
          </form>
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
              disabled={isLoading}
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
