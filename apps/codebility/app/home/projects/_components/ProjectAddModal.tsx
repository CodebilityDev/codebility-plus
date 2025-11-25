"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  createProject,
  getProjectCategories,
  getProjectClients,
  getProjectCodevs,
} from "@/app/home/projects/actions";
import ProjectAvatar from "@/components/ProjectAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberSelection } from "@/components/ui/MemberSelection";
import { useModal as useGlobalModal } from "@/hooks/use-modal";
import { useModal } from "@/hooks/use-modal-projects";
import { useTechStackStore } from "@/hooks/use-techstack";
import { Client, Codev, SkillCategory } from "@/types/home/codev";
import { uploadImage } from "@/utils/uploadImage";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";

import ImageCrop from "./ImageCrop";

export interface ProjectFormData {
  name: string;
  description?: string;
  tagline?: string;
  key_features?: string;
  gallery?: string;
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  start_date?: string;
  category_ids?: number[]; // Changed from project_category_id to support multiple categories
  client_id?: string;
  main_image?: string;
  tech_stack?: string[];
}

const PROJECT_ADD_MODAL_TITLE = "Create New Project";

const ProjectAddModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { onOpen: openGlobalModal } = useGlobalModal();
  const { stack: selectedTechStack, clearStack } = useTechStackStore();
  const isModalOpen = isOpen && type === "projectAddModal";

  // Data states
  const [users, setUsers] = useState<Codev[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [currentTeamLeader, setCurrentTeamLeader] = useState<Codev | null>(
    null,
  );
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);

  // Image states
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  // Gallery states
  const [galleryImages, setGalleryImages] = useState<
    { url: string; file: File }[]
  >([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({ mode: "onChange" });

  // Prepare select options using useMemo
  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
        subLabel: user.display_position,
        imageUrl: user.image_url || undefined,
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
        imageUrl: client.company_logo || undefined,
      })),
    [clients],
  );

  // Handler for team leader selection
  const handleTeamLeaderSelect = useCallback(
    (value: string) => {
      const leader = users.find((user) => user.id === value);
      if (leader) {
        setCurrentTeamLeader(leader);
        // Remove from selected members if present
        setSelectedMembers((prev) =>
          prev.filter((member) => member.id !== value),
        );
      }
    },
    [users],
  );

  // Fetch initial data
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

  const resetForm = () => {
    reset();
    setProjectImage(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setGalleryImages([]);
    setSelectedMembers([]);
    setCurrentTeamLeader(null);
    setSelectedCategoryIds([]); // Clear selected categories
    clearStack(); // Clear tech stack selection
    onClose();
  };

  // Subcomponents remain mostly the same, just update the SelectSection
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
                  checked={selectedCategoryIds.includes(Number(category.id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategoryIds([
                        ...selectedCategoryIds,
                        Number(category.id),
                      ]);
                    } else {
                      setSelectedCategoryIds(
                        selectedCategoryIds.filter(
                          (id) => id !== Number(category.id),
                        ),
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
            Client
          </label>
          <CustomSelect
            label="Client"
            options={clientOptions}
            onChange={(value) => setValue("client_id", value)}
            placeholder="Select Client"
            disabled={isDataLoading}
            searchable
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
              onChange={handleTeamLeaderSelect}
              placeholder="Select Team Leader"
              disabled={isDataLoading}
              searchable
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Team Members
            </label>
            <MemberSelection
              users={users.filter((user) => user.id !== currentTeamLeader?.id)}
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
    if (!currentTeamLeader) {
      toast.error("Team leader is required");
      return;
    }
    if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
      toast.error("At least one project category is required");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();

      // Upload main image if provided
      if (croppedFile) {
        const uploadResult = await uploadImage(croppedFile, {
          bucket: "codebility",
          folder: `projectImage/${Date.now()}_${croppedFile.name.replace(/\s+/g, "_")}`,
        });

        if (!uploadResult) {
          throw new Error("Failed to upload image");
        }
        form.append("main_image", uploadResult);
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

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          // Handle array fields
          if (key === "key_features") {
            const arrayValue = value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
            if (arrayValue.length > 0) {
              form.append(key, JSON.stringify(arrayValue));
            }
          } else if (key !== "gallery") {
            // Skip gallery as it's handled separately
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

      // Prepare project members with roles
      const projectMembers = [
        // Add team leader with team_leader role
        {
          codev_id: currentTeamLeader.id,
          role: "team_leader",
        },
        // Add other members with member role
        ...selectedMembers.map((member) => ({
          codev_id: member.id,
          role: "member",
        })),
      ];

      form.append("project_members", JSON.stringify(projectMembers));

      const response = await createProject(
        form,
        selectedMembers,
        currentTeamLeader.id,
      );
      if (response.success) {
        toast.success("Project created successfully!");
        resetForm();
      } else {
        toast.error(response.error || "Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  // Subcomponent: ImageUploadSection
  const ImageUploadSection = () => (
    <div className="flex flex-col items-center gap-6">
      {/* Image Preview */}
      <div className="relative w-full max-w-md">
        {croppedImage ? (
          <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Image
              src={croppedImage}
              alt="Project Preview"
              fill
              className="cursor-pointer object-cover transition-opacity hover:opacity-80"
              onClick={() => setOpenImageCropper(true)}
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
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
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
          }}
        />
        {projectImage && (
          <button
            type="button"
            onClick={() => {
              setProjectImage(null);
              setValue("main_image", undefined);
              setCroppedImage(null);
              setCroppedFile(null);
            }}
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

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-lg font-bold">
            {PROJECT_ADD_MODAL_TITLE}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-600 dark:text-gray-400">
            Fill in the project details below to create a new project.
          </DialogDescription>
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
                Project Image{" "}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  (Optional)
                </span>
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
              disabled={isLoading || isDataLoading}
              onClick={handleSubmit(onSubmit)}
              className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </div>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAddModal;
