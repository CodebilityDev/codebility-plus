import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/app/home/projects/_lib/constants";
import {
  ProjectFormValues,
  projectSchema,
} from "@/app/home/projects/_lib/schema";
import { Client, User } from "@/app/home/projects/_types/projects";
import { createProject } from "@/app/home/projects/actions";
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
import { IconPlus } from "@/public/assets/svgs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

const ProjectAddModal = () => {
  const supabase = useSupabase();

  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "projectAddModal";

  const [users, setUsers] = useState<User[] | any[] | null>([]);
  const [clients, setClients] = useState<Client[] | null>([]);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<User[] | any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("codev")
        .select("*, user(*, profile(*))")
        .eq("application_status", "ACCEPTED");

      if (error) {
        if (error) throw error;
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase.from("clients").select("*");

      if (error) {
        if (error) throw error;
        console.error("Error fetching clients:", error);
      } else {
        setClients(data);
      }
    };

    fetchClients();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
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

  const handleUploadProjectThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);
      setProjectImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveProjectThumbnail = () => {
    setProjectImage(null);
  };

  const handleSubmitData = async (data: ProjectFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (data.thumbnail) formData.append("thumbnail", data.thumbnail);
      formData.append("project_name", data.project_name);
      formData.append("clientId", data.clientId);
      formData.append("team_leader_id", data.team_leader_id);
      if (data.github_link) formData.append("github_link", data.github_link);
      if (data.live_link) formData.append("live_link", data.live_link);
      if (data.figma_link) formData.append("figma_link", data.figma_link);
      if (data.summary) formData.append("summary", data.summary);

      const response = await createProject(formData, selectedMembers);

      if (response.success) {
        toast.success("New Project has been added!");
      } else {
        toast.error("Failed to create project");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      reset();
      setProjectImage(null);
      setSelectedMembers([]);
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-5 overflow-y-auto lg:h-[45rem] lg:justify-between lg:overflow-hidden"
      >
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">
            Add New Project
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleSubmitData)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="relative mx-auto flex size-[100px] md:mx-0 md:size-[80px]">
                <Image
                  src={projectImage || DEFAULT_AVATAR}
                  alt="Project Thumbnail"
                  fill
                  className="bg-dark-400 h-auto w-auto rounded-full bg-cover object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <p className="text-md text-gray">Image size 1080 x 768 px</p>
                <div className="flex gap-4">
                  {!projectImage && (
                    <label htmlFor="thumbnail">
                      <p className="cursor-pointer text-blue-100">
                        Upload Image
                      </p>
                    </label>
                  )}
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    name="thumbnail"
                    onChange={handleUploadProjectThumbnail}
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
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="w-full space-y-3">
                <Input
                  id="projectName"
                  type="text"
                  label="Name"
                  placeholder="Enter Project Name"
                  {...register("project_name")}
                  className={`dark:bg-dark-200 ${
                    errors.project_name
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }`}
                />
                {errors.project_name && (
                  <span className="text-sm text-red-400">
                    {errors.project_name.message}
                  </span>
                )}
                <div>
                  <label>Client</label>
                  <Select
                    onValueChange={(value) => {
                      setValue("clientId", value);
                      clearErrors("clientId");
                    }}
                    name="clientId"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Client"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clients</SelectLabel>
                        {clients?.map((data) => (
                          <SelectItem key={data.id} value={String(data.id)}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.clientId && (
                    <span className="text-sm text-red-400">
                      {errors.clientId.message}
                    </span>
                  )}
                </div>
                <div>
                  <label>Team Leader</label>
                  <Select
                    onValueChange={(value) => {
                      setValue("team_leader_id", value);
                      clearErrors("team_leader_id");
                    }}
                    name="team_leader_id"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Team Leader"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Users</SelectLabel>
                        {users?.map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id}
                            className="capitalize"
                          >
                            {user.first_name} {user.last_name}
                          </SelectItem>
                        ))}
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
                  className={`dark:bg-dark-200 ${
                    errors.github_link
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }`}
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
                  className={`dark:bg-dark-200 ${
                    errors.live_link
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }`}
                />
                {errors.live_link && (
                  <span className="text-sm text-red-400">
                    {errors.live_link.message}
                  </span>
                )}
                <Input
                  id="figmaLink"
                  type="text"
                  label="Figma Link"
                  placeholder="Enter Figma Link"
                  {...register("figma_link")}
                  className={`dark:bg-dark-200 ${
                    errors.figma_link
                      ? "border border-red-500 focus:outline-none"
                      : ""
                  }`}
                />
                {errors.figma_link && (
                  <span className="text-sm text-red-400">
                    {errors.figma_link.message}
                  </span>
                )}
              </div>
            </div>
            <Textarea
              id="summary"
              label="Summary"
              placeholder="Enter Summary"
              {...register("summary")}
              className={`dark:bg-dark-200 ${
                errors.summary ? "border border-red-500 focus:outline-none" : ""
              }`}
            />
            {errors.summary && (
              <span className="text-sm text-red-400">
                {errors.summary.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="members">Members</label>
            <div className="flex gap-2">
              <div className="flex flex-wrap items-center">
                {selectedMembers.map((member, index) => {
                  return (
                    <div
                      className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                      key={`${member.id}_${index}`}
                      onClick={() => removeMember(member.id)}
                    >
                      <Image
                        alt="Avatar"
                        src={member.user.profile.image_url || DEFAULT_AVATAR}
                        fill
                        title={`${member.user.profile.first_name} ${member.user.profile.last_name}`}
                        className="h-auto w-full rounded-full bg-cover object-cover"
                        loading="eager"
                      />
                    </div>
                  );
                })}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Button
                    variant="hollow"
                    className="h-12 w-12 rounded-full p-0"
                  >
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
                    ?.filter((user) =>
                      `${user.first_name} ${user.last_name}`
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )
                    .map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        className="dark:hover:bg-dark-200 flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                        onClick={() => addMember(user)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                            <Image
                              alt="Avatar"
                              src={
                                user.user.profile.image_url || DEFAULT_AVATAR
                              }
                              fill
                              title={`${user.user.profile.first_name} ${user.user.profile.last_name}`}
                              className="h-auto w-full rounded-full bg-cover object-cover"
                              loading="eager"
                            />
                          </div>
                          <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
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
              onClick={(e) => {
                e.preventDefault();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="default"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              type="submit"
            >
              Add Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAddModal;
