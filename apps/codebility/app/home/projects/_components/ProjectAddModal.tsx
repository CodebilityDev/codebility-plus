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
import { useModal } from "@/hooks/use-modal-projects";
import { useModal as useGlobalModal } from "@/hooks/use-modal";
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
  github_link?: string;
  website_url?: string;
  figma_link?: string;
  start_date: string;
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
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Project Categories * (Select at least one)</label>
          <div className="grid grid-cols-2 gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                    } else {
                      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Client *</label>
          <CustomSelect
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
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Team Configuration</h4>
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Team Leader *</label>
            <CustomSelect
              options={userOptions.filter(
                (user) => !selectedMembers.find((member) => member.id === user.value),
              )}
              value={currentTeamLeader?.id || ""}
              onChange={handleTeamLeaderSelect}
              placeholder="Select Team Leader"
              disabled={isDataLoading}
              searchable
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Team Members</label>
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
      </div>
      
      {/* Tech Stack Selection */}
      <div className="border-t pt-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Technology Stack</h4>
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => openGlobalModal("techStackModal")}
            className="w-full h-12 justify-start text-left border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">+</span>
              {selectedTechStack.length > 0 
                ? `${selectedTechStack.length} technology(ies) selected` 
                : "Select Technologies Used"
              }
            </div>
          </Button>
          
          {/* Display selected tech stack */}
          {selectedTechStack.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {selectedTechStack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white shadow-sm"
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
    if (!formData.client_id) {
      toast.error("Client is required");
      return;
    }
    if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
      toast.error("At least one project category is required");
      return;
    }
    if (!croppedFile) {
      toast.error("Project image is required");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();

      // Upload image
      const publicUrl = await uploadImage(croppedFile, {
        bucket: "codebility",
        folder: `projectImage/${Date.now()}_${croppedFile.name.replace(/\s+/g, "_")}`,
      });

      if (!publicUrl) {
        throw new Error("Failed to upload image");
      }

      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value);
        }
      });
      form.append("main_image", publicUrl);

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
          <div className="relative h-48 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
            <Image
              src={croppedImage}
              alt="Project Preview"
              fill
              className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setOpenImageCropper(true)}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Click to edit</span>
            </div>
          </div>
        ) : (
          <div className="h-48 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-3">
            <ProjectAvatar size={64} />
            <p className="text-sm text-gray-500 dark:text-gray-400">No image selected</p>
          </div>
        )}
      </div>
      
      {/* Upload Controls */}
      <div className="flex gap-3">
        <label
          htmlFor="image-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          {croppedImage ? 'Change Image' : 'Upload Image'}
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
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
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
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Project Name *</label>
          <Input
            type="text"
            placeholder="Enter a descriptive project name"
            {...register("name", { required: "Project name is required" })}
            className="h-11 focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
          />
          {errors.name && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="w-4 h-4 text-red-500">⚠</span>
              {errors.name.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Project Description *</label>
          <textarea
            placeholder="Describe what this project is about, its goals, and key features"
            {...register("description", {
              required: "Project description is required",
            })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800"
          />
          {errors.description && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="w-4 h-4 text-red-500">⚠</span>
              {errors.description.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Start Date *</label>
          <Input
            type="date"
            {...register("start_date", { required: "Start date is required" })}
            className="h-11 focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
          />
          {errors.start_date && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <span className="w-4 h-4 text-red-500">⚠</span>
              {errors.start_date.message}
            </p>
          )}
        </div>
      </div>
      
      {/* External Links */}
      <div className="border-t pt-3">
        <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-2">External Links (Optional)</h4>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">GitHub Repository</label>
            <Input
              type="url"
              placeholder="https://github.com/..."
              {...register("github_link")}
              className="h-11 focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Live Website</label>
            <Input
              type="url"
              placeholder="https://yourproject.com"
              {...register("website_url")}
              className="h-11 focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Figma Design</label>
            <Input
              type="url"
              placeholder="https://figma.com/..."
              {...register("figma_link")}
              className="h-11 focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-lg font-bold">{PROJECT_ADD_MODAL_TITLE}</DialogTitle>
          <DialogDescription className="text-xs text-gray-600 dark:text-gray-400">
            Fill in the project details below to create a new project.
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 p-3" style={{ maxHeight: "calc(80vh - 200px)" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Image Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Project Image
              </h3>
              <ImageUploadSection />
            </div>
            
            {/* Project Details Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Project Information
              </h3>
              <ProjectDetailsSection />
            </div>
            
            {/* Team & Configuration Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Team & Configuration
              </h3>
              <SelectSection />
            </div>
          </form>
        </div>
        
        <DialogFooter className="border-t pt-4 bg-gray-50 dark:bg-gray-800/30">
          <div className="flex justify-end gap-3 w-full">
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
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
