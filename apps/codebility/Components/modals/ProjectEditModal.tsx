import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { parseMembers } from "@/app/home/projects/_lib";
import { DEFAULT_AVATAR, STATUS } from "@/app/home/projects/_lib/constants";
import {
  ProjectFormValues,
  projectSchema,
} from "@/app/home/projects/_lib/schema";
import { Client, User } from "@/app/home/projects/_types/projects";
import { updateProject } from "@/app/home/projects/actions";
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
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

const ProjectEditModal = () => {
  const supabase = getSupabaseBrowserClient();

  const { isOpen, onClose, type, onOpen, data } = useModal();
  const isModalOpen = isOpen && type === "projectEditModal";

  const [users, setUsers] = useState<User[] | null>([]);
  const [clients, setClients] = useState<Client[] | null>([]);
  const [projectImage, setProjectImage] = useState<string | any>();
  const [isLoading, setIsLoading] = useState(false);
  const membersParsed = parseMembers(data?.members || []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("codev")
        .select("*")
        .eq("application_status", "ACCEPTED");

      if (error) {
        if (error) throw error;
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    if (isModalOpen) {
      fetchUsers();
    }
  }, [isModalOpen]);

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

    if (isModalOpen) {
      fetchClients();
    }
  }, [isModalOpen]);

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

  useEffect(() => {
    if (data) {
      setValue("project_name", data.name as string);
      setValue("clientId", data.client_id as string);
      setValue("team_leader_id", data.team_leader_id as string);
      setValue("status", data.status);
      setValue("github_link", data.github_link as string);
      setValue("live_link", data.live_link as string);
      setValue("figma_link", data.figma_link as string);
      setValue("summary", data.summary);
      setProjectImage(data.thumbnail);
    }
  }, [data]);

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

  const handleSubmitData = async (editData: ProjectFormValues) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (editData.thumbnail) formData.append("thumbnail", editData.thumbnail);
      formData.append("project_name", editData.project_name);
      formData.append("clientId", editData.clientId);
      formData.append("team_leader_id", editData.team_leader_id);
      if (editData.status) formData.append("status", editData.status);
      if (editData.github_link)
        formData.append("github_link", editData.github_link);
      if (editData.live_link) formData.append("live_link", editData.live_link);
      if (editData.figma_link)
        formData.append("figma_link", editData.figma_link);
      if (editData.summary) formData.append("summary", editData.summary);

      const response = await updateProject(data?.id as string, formData);
      if (response.success) {
        toast.success("Project updated succesfully!");
      } else {
        toast.error("Failed to update project");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      reset();
      setProjectImage(null);
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-5 overflow-y-auto lg:h-[45rem] lg:justify-between lg:overflow-hidden"
      >
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">
            Edit Project
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
                    <label
                      htmlFor="thumbnail"
                      className="cursor-pointer text-blue-100"
                    >
                      Upload Image
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
                  {...register("project_name")}
                  className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white"
                />

                <div>
                  <label>Client</label>
                  <Select
                    {...register("clientId")}
                    onValueChange={(value) => setValue("clientId", value)}
                    defaultValue={data?.client_id}
                  >
                    <SelectTrigger className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white">
                      <SelectValue placeholder="Select a client" />
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
                </div>

                <div>
                  <label>Team Leader</label>
                  <Select
                    {...register("team_leader_id")}
                    onValueChange={(value) => setValue("team_leader_id", value)}
                    defaultValue={data?.team_leader_id}
                  >
                    <SelectTrigger className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white">
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
                </div>
                <div>
                  <label>Status</label>
                  <Select
                    {...register("status")}
                    onValueChange={(value) => setValue("status", value)}
                    defaultValue={data?.status}
                  >
                    <SelectTrigger className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white">
                      <SelectValue placeholder="Select project status"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {STATUS?.map((data) => (
                          <SelectItem key={data} value={data}>
                            {data}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-full">
                <Input
                  id="githubLink"
                  type="text"
                  label="Github"
                  {...register("github_link")}
                  className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white"
                />
                <Input
                  id="liveLink"
                  type="text"
                  label="Live URL"
                  {...register("live_link")}
                  className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white"
                />
                <Input
                  id="figmaLink"
                  type="text"
                  label="Figma Link"
                  {...register("figma_link")}
                  className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white"
                />
                <div className="mt-4 flex flex-col gap-1">
                  <label>Members</label>
                  <div className="flex -space-x-3 *:ring">
                    {membersParsed.slice(0, 5).map((member) => (
                      <div
                        className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                        key={member.id}
                      >
                        <Image
                          alt={`${member.first_name}'s avatar`}
                          src={member.image_url || DEFAULT_AVATAR}
                          fill
                          title={`${member.first_name}'s avatar`}
                          className="h-auto w-full rounded-full bg-cover object-cover"
                          loading="eager"
                        />
                      </div>
                    ))}
                    <div className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover">
                      <Button
                        variant="hollow"
                        type="button"
                        className="h-12 w-12 rounded-full p-0"
                        onClick={() => onOpen("projectMembersModal", data)}
                      >
                        <IconPlus className="invert dark:invert-0" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Textarea
              id="summary"
              label="Summary"
              {...register("summary")}
              className="dark:bg-dark-200 bg-slate-200 text-black dark:text-white"
            />
          </div>

          <DialogFooter className="flex flex-col gap-4 lg:flex-row">
            <Button
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              type="submit"
              disabled={isLoading}
            >
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;
