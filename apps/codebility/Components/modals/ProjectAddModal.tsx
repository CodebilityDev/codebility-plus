import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { createProjects } from "@/app/api/projects";
import { Button } from "@/Components/ui/button";
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
import useToken from "@/hooks/use-token";
import { API } from "@/lib/constants";
import { IconPlus } from "@/public/assets/svgs";
import { User } from "@/types";
import { modals_ProjectModal } from "@/types/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

const projectSchema = z.object({
  project_name: z.string().min(1, { message: "Project name is required" }),
  github_link: z.string().url({ message: "Invalid URL" }).optional(),
  summary: z.string().min(1, { message: "Summary is required" }),
  live_link: z.string().url({ message: "Invalid URL" }).optional(),
  project_thumbnail: z.string().url({ message: "Invalid URL" }).optional(),
  clientId: z.string().min(1, { message: "Client is required" }),
  team_leader_id: z.string().min(1, { message: "Team Leader is required" }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const defaultImage =
  "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";

const ProjectAddModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "projectAddModal";
  const { token } = useToken();
  const [isLoading, setIsLoading] = useState(false);
  const [projectImage, setProjectImage] = useState<string | any>();

  const { data: clients }: UseQueryResult<modals_ProjectModal[]> = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await axios(API.CLIENTS);
      return response.data.data;
    },
  });

  const { data: users }: UseQueryResult<User[]> = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios(API.USERS);
      return response.data.data;
    },
  });

  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  const addMember = (member: User) => {
    if (!selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers((prevMembers) => [...prevMembers, member]);
    }
  };

  const removeMember = (id: string) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id),
    );
  };

  const resetForm = () => {
    reset();
    setProjectImage(null);
    setSelectedMembers([]);
    onClose();
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setIsLoading(true);

    try {
      const response = await createProjects(
        {
          ...data,
          project_thumbnail: projectImage, // Include the uploaded image URL
        },
        selectedMembers.map((member) => ({ id: member.id })),
        token,
      );

      if (response.status === 201) {
        resetForm();
        toast.success("New Project has been Added!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadProjectThumbnail = async (
    ev: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = ev.target.files?.[0];

    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(`${API.USERS}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const image_url = response.data.data.image_url;
      setProjectImage(image_url);
    }
  };

  const handleRemoveProjectThumbnail = () => {
    setProjectImage(null);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-[44rem]">
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">
            Add New Project
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="bg-gray flex h-14 w-28 items-center justify-center overflow-hidden rounded-lg md:h-20 md:w-40">
              {projectImage ? (
                <Image
                  src={projectImage}
                  width={120}
                  height={120}
                  alt="Project Thumbnail"
                  className="w-full"
                />
              ) : (
                <Image
                  src="/assets/svgs/icon-cog.svg"
                  width={30}
                  height={30}
                  alt="logo"
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-2">
              <p className="text-md text-gray">Image size 1080 x 768 px</p>
              <div className="flex gap-4">
                {!projectImage && (
                  <label htmlFor="projectThumbnailUpload">
                    <p className="cursor-pointer text-blue-100">Upload Image</p>
                  </label>
                )}
                <input
                  onChange={handleUploadProjectThumbnail}
                  id="projectThumbnailUpload"
                  type="file"
                  className="hidden"
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
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="w-full space-y-3">
                <Input
                  id="projectName"
                  type="text"
                  label="Name"
                  placeholder="Enter Project Name"
                  {...register("project_name")}
                  className={
                    errors.project_name
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }
                />
                {errors.project_name && (
                  <span className="text-sm text-red-400">
                    {errors.project_name.message}
                  </span>
                )}

                <div className="">
                  <label>Client</label>
                  <Select
                    onValueChange={(value) => setValue("clientId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Client"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clients</SelectLabel>
                        {clients?.map(
                          (client: { id: string; company_name: string }) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.company_name}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.clientId && (
                    <span className="text-sm text-red-400">
                      {errors.clientId.message}
                    </span>
                  )}
                </div>
                <div className="">
                  <label>Team Leader</label>
                  <Select
                    onValueChange={(value) => setValue("team_leader_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Team Leader"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Users</SelectLabel>
                        {users?.map(
                          (user: { id: string; first_name: string }) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.first_name}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.team_leader_id && (
                    <span className="text-sm text-red-400">
                      {errors.team_leader_id.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full">
                <Input
                  id="githubLink"
                  type="text"
                  label="Github"
                  placeholder="Enter Github Link"
                  {...register("github_link")}
                  className={
                    errors.github_link
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }
                />
                {errors.github_link && (
                  <span className="text-sm text-red-400">
                    {errors.github_link.message}
                  </span>
                )}

                <Input
                  id="liveLink"
                  type="text"
                  label="Live URL"
                  placeholder="Enter Live URL"
                  {...register("live_link")}
                  className={
                    errors.live_link
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }
                />
                {errors.live_link && (
                  <span className="text-sm text-red-400">
                    {errors.live_link.message}
                  </span>
                )}

                <Input
                  id="productionLink"
                  type="text"
                  label="Link"
                  placeholder="Enter Project Thumbnail URL"
                  {...register("project_thumbnail")}
                  className={
                    errors.project_thumbnail
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }
                />
                {errors.project_thumbnail && (
                  <span className="text-sm text-red-400">
                    {errors.project_thumbnail.message}
                  </span>
                )}
              </div>
            </div>

            <Textarea
              id="summary"
              label="Summary"
              style={{ color: "black" }}
              placeholder="Enter Summary"
              {...register("summary")}
              className={
                errors.summary ? "border border-red-500 focus:outline-none" : ""
              }
            />
            {errors.summary && (
              <span className="text-sm text-red-400">
                {errors.summary.message}
              </span>
            )}
          </form>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="members">Members</label>
          <div className="flex gap-2">
            <div className="flex flex-wrap items-center">
              {selectedMembers.map((member, index) => (
                <div
                  className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                  key={`${member.id}_${index}`}
                  onClick={() => removeMember(member.id)}
                >
                  <Image
                    alt="Avatar"
                    src={member.image_url ?? defaultImage}
                    fill
                    title={`${member.id}'s Avatar`}
                    className="h-auto w-full rounded-full bg-cover object-cover"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <Button variant="hollow" className="h-12 w-12 rounded-full p-0">
                  <IconPlus className="invert dark:invert-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                sideOffset={10}
                align="start"
                className="dark:bg-dark-100 z-10 max-h-[200px] overflow-y-auto rounded-lg bg-white"
              >
                <DropdownMenuLabel className="pb-2 text-center text-sm">
                  Add Members
                </DropdownMenuLabel>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search members"
                  className="dark:bg-dark-200 mb-2 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none"
                />
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="px-4 py-2 text-xs">
                  Available Members
                </DropdownMenuLabel>
                {users
                  ?.filter((user: { first_name: any; last_name: any }) =>
                    `${user.first_name} ${user.last_name}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((user: User) => (
                    <DropdownMenuItem
                      key={user.id}
                      className="dark:hover:bg-dark-200 flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                      onClick={() => addMember(user)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                          <Image
                            alt="Avatar"
                            src={user.image_url ?? defaultImage}
                            fill
                            title={`${user.id}'s Avatar`}
                            className="h-auto w-full rounded-full bg-cover object-cover"
                            loading="eager"
                          />
                        </div>
                        <span>{`${user.first_name} ${user.last_name}`}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-4 lg:flex-row">
          <Button
            variant="hollow"
            className="order-2 w-full sm:order-1 sm:w-[130px]"
            onClick={resetForm}
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid || isLoading}
            variant="default"
            className="order-1 w-full sm:order-2 sm:w-[130px]"
            onClick={handleSubmit(onSubmit)}
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAddModal;
