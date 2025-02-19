"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  createProject,
  getProjectCategories,
  getProjectClients,
  getProjectCodevs,
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { CustomSelect } from "@/Components/ui/CustomSelect";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { MemberSelection } from "@/Components/ui/MemberSelection";
import { useModal } from "@/hooks/use-modal-projects";
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
  project_category_id?: string;
  team_leader_id?: string;
  client_id?: string;
  main_image?: string;
}

const PROJECT_ADD_MODAL_TITLE = "Create New Project";

const ProjectAddModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "projectAddModal";

  // Data states
  const [users, setUsers] = useState<Codev[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  // Image states
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  // Team selection states
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [teamLeaderId, setTeamLeaderId] = useState<string>("");

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

  // Handler for team leader selection
  const handleTeamLeaderSelect = useCallback(
    (value: string) => {
      setTeamLeaderId(value);
      setValue("team_leader_id", value, { shouldValidate: true });
      // Remove team leader from selected members if present
      setSelectedMembers((prev) =>
        prev.filter((member) => member.id !== value),
      );
    },
    [setValue],
  );

  // Fetch initial data for users, clients, and categories
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
    setTeamLeaderId("");
    onClose();
  };

  // Subcomponent: ImageUploadSection
  const ImageUploadSection = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {croppedImage ? (
          <Image
            src={croppedImage}
            alt="Project"
            className="h-full w-full cursor-pointer object-contain"
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
            onClick={() => {
              setProjectImage(null);
              setValue("main_image", undefined);
              setCroppedImage(null);
              setCroppedFile(null);
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove Image
          </button>
        )}
      </div>
    </div>
  );

  // Subcomponent: ProjectDetailsSection (with labels)
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
            {...register("start_date", {
              required: "Start date is required",
            })}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
          />
          {errors.start_date && (
            <p className="text-sm text-red-500">{errors.start_date.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Subcomponent: SelectSection (dropdowns and member selection)
  const SelectSection = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CustomSelect
        label="Team Leader"
        options={userOptions.filter(
          (user) => !selectedMembers.find((member) => member.id === user.value),
        )}
        value={teamLeaderId}
        onChange={handleTeamLeaderSelect}
        placeholder="Select Team Leader"
        disabled={isDataLoading}
      />
      <CustomSelect
        label="Project Category"
        options={categoryOptions}
        onChange={(value) => setValue("project_category_id", value)}
        placeholder="Select Project Category"
        variant="simple"
      />
      <CustomSelect
        label="Client"
        options={clientOptions}
        onChange={(value) => setValue("client_id", value)}
        placeholder="Select Client"
        disabled={isDataLoading}
      />
      <MemberSelection
        users={users.filter((user) => user.id !== teamLeaderId)}
        selectedMembers={selectedMembers}
        onMemberAdd={(member) =>
          setSelectedMembers((prev) => [...prev, member])
        }
        onMemberRemove={(memberId) =>
          setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId))
        }
        excludeMembers={teamLeaderId ? [teamLeaderId] : []}
      />
    </div>
  );

  const onSubmit = async (data: ProjectFormData) => {
    // Validate required fields
    if (!teamLeaderId) {
      toast.error("Team leader is required");
      return;
    }
    if (!data.client_id) {
      toast.error("Client is required");
      return;
    }
    if (!data.project_category_id) {
      toast.error("Project category is required");
      return;
    }
    setIsLoading(true);
    try {
      const form = new FormData();
      if (!croppedFile) {
        throw new Error("Image is required");
      }
      // Upload image
      const fileNameWithoutSpaces = croppedFile.name.replace(/\s+/g, "_");
      const { publicUrl } = await uploadImage(croppedFile, {
        bucket: "codebility",
        folder: "projectImage",
      });
      if (!publicUrl) {
        throw new Error("Failed to upload image");
      }
      data.main_image = publicUrl;
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value);
        }
      });
      const memberIds = selectedMembers.map((member) => member.id);
      form.append("members", JSON.stringify(memberIds));
      // Pass teamLeaderId as the third argument
      const response = await createProject(form, selectedMembers, teamLeaderId);
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

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{PROJECT_ADD_MODAL_TITLE}</DialogTitle>
          <DialogDescription>
            Fill in the project details below.
          </DialogDescription>
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
              onClick={resetForm}
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
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAddModal;
