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
import ProjectAvatar from "@/components/ProjectAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberSelection } from "@/components/ui/MemberSelection";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useModal as useGlobalModal } from "@/hooks/use-modal";
import { useModal } from "@/hooks/use-modal-projects";
import { useTechStackStore } from "@/hooks/use-techstack";
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
  tagline?: string;
  key_features?: string;
  gallery?: string;
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  start_date: string;
  category_ids?: number[]; // Changed from project_category_id to support multiple categories
  client_id?: string;
  status?: string;
  main_image?: string;
  tech_stack?: string[];
}

const ProjectEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { onOpen: openGlobalModal } = useGlobalModal();
  const {
    stack: selectedTechStack,
    clearStack,
    setStack,
  } = useTechStackStore();
  const isModalOpen = isOpen && type === "projectEditModal";
  const queryClient = useQueryClient();

  // Data states
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
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

  // Gallery states
  const [galleryImages, setGalleryImages] = useState<
    { url: string; file: File }[]
  >([]);

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

  // Fetch users data with React Query - always keep this data cached
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["projectCodevs"],
    queryFn: async () => {
      const result = await getProjectCodevs();
      return result || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch clients data with React Query - always keep this data cached
  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ["projectClients"],
    queryFn: async () => {
      const result = await getProjectClients();
      return result || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch categories data with React Query - always keep this data cached
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["projectCategories"],
    queryFn: async () => {
      const result = await getProjectCategories();
      return result || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Only show loading for essential data that blocks form interaction
  const isDataLoading = false; // Allow form to show immediately
  const isSelectDataLoading =
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

  // Populate form fields immediately when modal opens with project data
  useEffect(() => {
    if (data && isModalOpen) {
      // Reset image loading state
      setImageLoaded(false);

      // Set form values immediately - don't wait for users to load
      setValue("name", data.name || "");
      setValue("description", data.description || "");
      setValue("tagline", data.tagline || "");
      setValue(
        "key_features",
        data.key_features && Array.isArray(data.key_features) ? data.key_features.join(", ") : "",
      );
      setValue("github_link", data.github_link || "");
      setValue("website_url", data.website_url || "");
      setValue("figma_link", data.figma_link || "");
      setValue("client_id", data.client_id || "");

      // Set selected categories from the data
      if (data.categories && Array.isArray(data.categories)) {
        setSelectedCategoryIds(data.categories.map((cat) => cat.id));
      } else {
        setSelectedCategoryIds([]);
      }

      setValue("status", data.status || "pending");
      if (data.start_date) {
        setValue("start_date", data.start_date);
      }
      setProjectImage(data.main_image || null);
      setCroppedImage(data.main_image || null);
      setSelectedStatus(data.status || "pending");

      // Set tech stack if available
      if (data.tech_stack && Array.isArray(data.tech_stack)) {
        setStack(data.tech_stack);
      } else {
        clearStack();
      }
    }
  }, [data, setValue, isModalOpen, setStack, clearStack]);

  // Separate useEffect for team member initialization when users data becomes available
  useEffect(() => {
    if (data && users.length > 0 && isModalOpen) {
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
  }, [data, users, isModalOpen]);

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
    setGalleryImages([]);
    setSelectedMembers([]);
    setCurrentTeamLeader(null);
    setImageLoaded(false);
    clearStack(); // Clear tech stack selection
    onClose();
  };

  // Subcomponent: ImageUploadSection with optimized loading
  const ImageUploadSection = () => (
    <div className="flex flex-col items-center gap-6">
      {/* Image Preview */}
      <div className="relative w-full max-w-md">
        {croppedImage ? (
          <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <Skeleton className="h-full w-full" />
              </div>
            )}
            <Image
              src={croppedImage}
              alt="Project Preview"
              fill
              className={`cursor-pointer object-cover transition-opacity hover:opacity-80 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => setOpenImageCropper(true)}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <span className="text-sm font-medium text-white">
                Click to edit
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
            <ProjectAvatar size={64} />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No image selected
            </p>
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="flex gap-3">
        <label
          htmlFor="image-upload"
          className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {croppedImage ? "Change Image" : "Upload Image"}
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
            className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Remove
          </button>
        )}
      </div>

      <ImageCrop
        image={projectImage || ""}
        setImage={setCroppedImage}
        setFile={setCroppedFile}
        open={openImageCropper}
        setOpen={setOpenImageCropper}
      />
    </div>
  );

  // Subcomponent: ProjectDetailsSection
  const ProjectDetailsSection = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Project Name *
          </label>
          <Input
            type="text"
            placeholder="Enter a descriptive project name"
            {...register("name", { required: "Project name is required" })}
            className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
          />
          {errors.name && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              <span className="h-4 w-4 text-red-500">⚠</span>
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Tagline
          </label>
          <Input
            type="text"
            placeholder="A catchy tagline for your project"
            {...register("tagline")}
            className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Project Description
          </label>
          <textarea
            placeholder="Describe what this project is about, its goals, and key features"
            {...register("description")}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Key Features
          </label>
          <textarea
            placeholder="Enter key features separated by commas (e.g., Responsive Design, Modern UI/UX, Cross-platform)"
            {...register("key_features")}
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Gallery Images
          </label>
          <div className="space-y-3">
            <label
              htmlFor="gallery-upload"
              className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              + Add Gallery Images
            </label>
            <input
              id="gallery-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                const files = Array.from(e.target.files || []);
                for (const file of files) {
                  const objectUrl = URL.createObjectURL(file);
                  setGalleryImages((prev) => [
                    ...prev,
                    { url: objectUrl, file },
                  ]);
                }
                // Reset the input value to allow selecting the same files again
                e.target.value = '';
              }}
            />

            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <div key={index} className="group relative">
                    <div className="relative h-24 w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                      <Image
                        src={image.url}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white transition-colors hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <Input
            type="date"
            {...register("start_date")}
            className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
          />
        </div>
      </div>

      {/* External Links */}
      <div className="border-t pt-3">
        <h4 className="mb-2 text-xs font-medium text-gray-900 dark:text-gray-100">
          External Links (Optional)
        </h4>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              GitHub Repository
            </label>
            <Input
              type="url"
              placeholder="https://github.com/..."
              {...register("github_link")}
              className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Live Website
            </label>
            <Input
              type="url"
              placeholder="https://yourproject.com"
              {...register("website_url")}
              className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Figma Design
            </label>
            <Input
              type="url"
              placeholder="https://figma.com/..."
              {...register("figma_link")}
              className="h-11 border-gray-300 focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Subcomponent: SelectSection
  const SelectSection = () => (
    <div className="space-y-6">
      {/* Project Configuration */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Project Categories * (Select at least one)
          </label>
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center space-x-2 rounded p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategoryIds([
                        ...selectedCategoryIds,
                        category.id,
                      ]);
                    } else {
                      setSelectedCategoryIds(
                        selectedCategoryIds.filter((id) => id !== category.id),
                      );
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Client *
          </label>
          <CustomSelect
            label="Client"
            options={clientOptions}
            onChange={(value) => setValue("client_id", value)}
            value={data?.client_id || ""}
            placeholder={
              isClientsLoading ? "Loading clients..." : "Select Client"
            }
            disabled={isClientsLoading}
            searchable
          />
        </div>
      </div>

      {/* Project Status */}
      <div className="border-t pt-6">
        <h4 className="text-md mb-4 font-medium text-gray-900 dark:text-gray-100">
          Project Status
        </h4>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Status *
          </label>
          <CustomSelect
            label="Status"
            options={PROJECT_STATUSES}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
            placeholder="Select Status"
            variant="simple"
          />
        </div>
      </div>

      {/* Team Configuration */}
      <div className="border-t pt-6">
        <h4 className="text-md mb-4 font-medium text-gray-900 dark:text-gray-100">
          Team Configuration
        </h4>
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Team Leader *
            </label>
            <CustomSelect
              label="Team Leader"
              options={userOptions.filter(
                (user) =>
                  !selectedMembers.find((member) => member.id === user.value),
              )}
              value={currentTeamLeader?.id || ""}
              onChange={(value) => {
                const leader = users.find((u) => u.id === value);
                if (leader) setCurrentTeamLeader(leader);
              }}
              placeholder={
                isUsersLoading ? "Loading users..." : "Select Team Leader"
              }
              disabled={isUsersLoading}
              searchable
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Team Members
            </label>
            {isUsersLoading ? (
              <div className="rounded-lg border border-gray-300 p-4 dark:border-gray-600">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  Loading team members...
                </div>
              </div>
            ) : (
              <MemberSelection
                users={users.filter(
                  (user) => user.id !== currentTeamLeader?.id,
                )}
                selectedMembers={selectedMembers}
                onMemberAdd={(member) =>
                  setSelectedMembers((prev) => [...prev, member])
                }
                onMemberRemove={(memberId) =>
                  setSelectedMembers((prev) =>
                    prev.filter((m) => m.id !== memberId),
                  )
                }
                excludeMembers={currentTeamLeader ? [currentTeamLeader.id] : []}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Selection */}
      <div className="border-t pt-6">
        <h4 className="text-md mb-4 font-medium text-gray-900 dark:text-gray-100">
          Technology Stack
        </h4>
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => openGlobalModal("techStackModal")}
            className="h-12 w-full justify-start border-2 border-dashed border-gray-300 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-blue-950"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                +
              </span>
              {selectedTechStack.length > 0
                ? `${selectedTechStack.length} technology(ies) selected`
                : "Select Technologies Used"}
            </div>
          </Button>

          {/* Display selected tech stack */}
          {selectedTechStack.length > 0 && (
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
              <div className="flex flex-wrap gap-2">
                {selectedTechStack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
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

    if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
      toast.error("At least one project category is required");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();

      // Handle image upload if there's a new cropped file
      if (croppedFile) {
        console.log("Uploading new image");
        const uploadResult = await uploadImage(croppedFile, {
          bucket: "codebility",
          folder: `projectImage/${Date.now()}_${croppedFile.name.replace(/\s+/g, "_")}`,
        });

        if (!uploadResult) {
          throw new Error("Failed to upload image");
        }

        // Set the new image URL
        console.log("Setting new main_image:", uploadResult);
        form.append("main_image", uploadResult);
      } else if (data.main_image && croppedImage) {
        // If using existing image without changes
        console.log("Keeping existing image:", data.main_image);
        form.append("main_image", data.main_image);
      }

      // Upload gallery images if provided
      if (galleryImages.length > 0) {
        const galleryUrls: string[] = [];
        for (const galleryImage of galleryImages) {
          const uploadResult = await uploadImage(galleryImage.file, {
            bucket: "codebility",
            folder: `projectGallery/${Date.now()}_${galleryImage.file.name.replace(/\s+/g, "_")}`,
          });
          if (uploadResult) {
            galleryUrls.push(uploadResult);
          }
        }
        if (galleryUrls.length > 0) {
          form.append("gallery", JSON.stringify(galleryUrls));
        }
      }

      // Add form data - make sure we add all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          key !== "main_image" &&
          key !== "gallery"
        ) {
          // Handle array fields
          if (key === "key_features") {
            const arrayValue = value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
            if (arrayValue.length > 0) {
              form.append(key, JSON.stringify(arrayValue));
            }
          } else {
            form.append(key, value);
          }
        }
      });

      // Add category IDs as JSON array
      form.append("category_ids", JSON.stringify(selectedCategoryIds));

      // Add tech stack
      if (selectedTechStack.length > 0) {
        form.append("tech_stack", JSON.stringify(selectedTechStack));
      }

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
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-lg font-bold">Edit Project</DialogTitle>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Update the project details below to modify your project.
          </p>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto p-3"
          style={{ maxHeight: "calc(80vh - 200px)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Image Section */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  1
                </span>
                Project Image
              </h3>
              <ImageUploadSection />
            </div>

            {/* Project Details Section */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  2
                </span>
                Project Information
              </h3>
              <ProjectDetailsSection />
            </div>

            {/* Team & Configuration Section */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  3
                </span>
                Team & Configuration
                {isSelectDataLoading && (
                  <div className="ml-2 flex items-center gap-2 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    Loading...
                  </div>
                )}
              </h3>
              <SelectSection />
            </div>
          </form>
        </div>

        <DialogFooter className="border-t bg-gray-50 pt-4 dark:bg-gray-800/30">
          <div className="flex w-full justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating...
                </div>
              ) : (
                "Update Project"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;
