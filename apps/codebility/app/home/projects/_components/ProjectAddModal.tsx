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
import { deleteImage, getImagePath, uploadImage } from "@/utils/uploadImage";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";

import ImageCrop from "./ImageCrop";

interface ProjectFormData {
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
const ProjectAddModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "projectAddModal";

  const [users, setUsers] = useState<Codev[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [teamLeaderId, setTeamLeaderId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [categories, setCategories] = useState<SkillCategory[]>([]);

  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    mode: "onChange",
  });

  // Transform data for select options
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
        subLabel: client.company_name,
        imageUrl: client.company_logo || undefined,
      })),
    [clients],
  );

  // Handlers

  const handleTeamLeaderSelect = useCallback(
    (value: string) => {
      setTeamLeaderId(value);
      setValue("team_leader_id", value);
      // Remove team leader from selected members if present
      setSelectedMembers((prev) =>
        prev.filter((member) => member.id !== value),
      );
    },
    [setValue],
  );

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

  const resetForm = () => {
    reset();
    setProjectImage(null);
    setCroppedImage(null);
    setCroppedFile(null);
    setSelectedMembers([]);
    onClose();
  };

  /* store image in state */
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      // store image in memory
      setProjectImage(URL.createObjectURL(file));
      setCroppedImage(URL.createObjectURL(file));
      setCroppedFile(file);

      setOpenImageCropper(true);
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image");
    }
  };

  /* remove image in state */
  const handleRemoveImage = async () => {
    if (!projectImage) return;

    try {
      setProjectImage(null);
      setValue("main_image", undefined);
      setCroppedImage(null);
    } catch (error) {
      console.error("Failed to remove image:", error);
      toast.error("Failed to remove image");
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!data.name || !data.start_date) {
      return;
    }

    setIsLoading(true);
    try {
      if (!croppedFile) {
        throw new Error("Image is required");
      }

      // upload image to the server
      const fileNameWithoutSpaces = croppedFile.name.replace(/\s+/g, "_");

      const { publicUrl } = await uploadImage(croppedFile, {
        bucket: "codebility",
        folder: `projectImage`, // Include file name in folder path
      });

      if (!publicUrl) {
        throw new Error("Failed to upload image");
      }

      //append image to data
      data.main_image = publicUrl;

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await createProject(formData, selectedMembers);

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

  console.log("cropImage", croppedImage);
  console.log("cropFile", croppedFile);

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the project details below
          </DialogDescription>
        </DialogHeader>

        <div className=" px-1" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div /* className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md" */
                className="relative"
              >
                {/* todo */}
                {croppedImage ? (
                  <Image
                    src={croppedImage}
                    alt="Project"
                    className="h-full w-full cursor-pointer object-contain"
                    onClick={() => setOpenImageCropper(true)}
                    width={408} //todo: might need to adjust this
                    height={192} //todo: might need to adjust this
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
                  className="cursor-pointer text-sm"
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

                {/* todo */}
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
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Project Description"
                  {...register("description")}
                  className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="GitHub Link"
                    {...register("github_link")}
                    className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Website URL"
                    {...register("website_url")}
                    className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Figma Link"
                    {...register("figma_link")}
                    className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    {...register("start_date", {
                      required: "Start date is required",
                    })}
                    className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black"
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red-500">
                      {errors.start_date.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Select Dropdowns */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomSelect
                  label="Team Leader"
                  options={userOptions.filter(
                    (user) =>
                      !selectedMembers.find(
                        (member) => member.id === user.value,
                      ),
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
              </div>
              <MemberSelection
                users={users.filter((user) => user.id !== teamLeaderId)}
                selectedMembers={selectedMembers}
                onMemberAdd={(member) =>
                  setSelectedMembers((prev) => [...prev, member])
                }
                onMemberRemove={(memberId) =>
                  setSelectedMembers((prev) =>
                    prev.filter((m) => m.id !== memberId),
                  )
                }
                excludeMembers={teamLeaderId ? [teamLeaderId] : []}
              />
            </div>
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
              className=" text-white"
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
