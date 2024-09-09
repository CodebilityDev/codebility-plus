import * as z from "zod"
import axios from "axios"
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { DialogTitle } from "@radix-ui/react-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

import { User } from "@/types"
import { Input } from "@codevs/ui/input"
import { Button } from "@/Components/ui/button"
import { API } from "@/lib/constants"
import useToken from "@/hooks/use-token"
import { Textarea } from "@codevs/ui/textarea"
import { IconPlus } from "@/public/assets/svgs"
import { createProjects } from "@/app/api/projects"
import { useModal } from "@/hooks/use-modal-projects"
import { modals_ProjectModal } from "@/types/components"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@codevs/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useSupabase } from "@codevs/supabase/hooks/use-supabase";

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';


import { InsertData } from "@/app/home/projects/actions"



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

  const supabase = useSupabase();

  const { isOpen, onClose, type } = useModal()
  const isModalOpen = isOpen && type === "projectAddModal"
  const { token } = useToken()
  const [isLoading, setIsLoading] = useState(false)
  const [projectImage, setProjectImage] = useState<string | any>()

  

  const { data: clients }: UseQueryResult<modals_ProjectModal[]> = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: users }: UseQueryResult<User[]> = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from('profile').select('*');
      if (error) throw error;
      return data;
    },
  });

  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [usersTest, setUsers] = useState<User[]>([]); // Default to an empty array

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  const addMember = (member: User) => {
    if (!selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers((prevMembers) => [...prevMembers, member]);
    }

    console.log(selectedMembers)
  }

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

  const handleSubmitData = async (event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData) as ProjectFormValues;
   

    try {

      projectSchema.parse(formValues); // This will throw an error if validation fails

       const teamLeaderId = formValues.team_leader_id; 


      if (!users) return


    // Assuming users is an array of user objects
    const teamLeader = users.find((user) => user.id === teamLeaderId); // Find user object

    // Extract first name
    const teamLeaderFirstName = teamLeader ? teamLeader.first_name : "Unknown";
    const teamLeaderLastName = teamLeader ? teamLeader.last_name : "Unknown";

    console.log("Selected Team Leader ID:", teamLeaderId);
    console.log("Selected Team Leader First Name:", teamLeader);


      await InsertData(formData, selectedMembers,teamLeaderFirstName ,teamLeaderLastName ); // Pass form data to DeleteData

      toast.success("New Project has been added!")

      reset();
      setProjectImage(null);
      setSelectedMembers([])
      onClose(); // Close the modal after successful deletion




    } catch (error) {
      toast.error("Something went wrong!")
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
    setProjectImage(null)
  }


  const clientsDummy = [
    { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', clients: 'Alice Johnson' },
  { id: 'a27c6d87-08e3-4eb2-9c28-d2d34b275a7c', clients: 'Bob Smith' },
  { id: '8f9f1a27-89b1-4b6e-9d8c-fc786e68de7d', clients: 'Charlie Davis' },
  { id: 'e3a64b68-16d7-4e3a-bd14-df94e4d6a5f1', clients: 'Dana Lee' },
  { id: 'd55a45e8-d1e6-4f75-8777-1bfb57fc8552', clients: 'Eva Martinez' },
  { id: 'f15b5c58-658e-46c1-96a0-d4f8cfb85e8b', clients: 'Frank Wilson' },
  { id: 'a6b9e1d6-2e42-4660-89ec-c7b37b1b9c8e', clients: 'Grace Kim' },
  { id: 'c9a05b62-f5fc-42e6-9460-6e7a7f3d6579', clients: 'Hannah Brown' },
  { id: 'b08b5a0e-9b8e-4c0c-8d5e-0fef0a2799a2', clients: 'Isaac Wilson' },
  { id: 'e278e925-3cf3-4a9b-9c35-806a4892b35f', clients: 'Jack Taylor' }
  ];

  

  return (
    <Dialog open={isModalOpen} onOpenChange={resetForm}>
      <DialogContent className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-[44rem]">
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">
            Add New Project
          </DialogTitle>
        </DialogHeader>


        <form onSubmit={handleSubmitData} className="flex flex-col gap-4">

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
                  name="file"
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


          <input type="hidden" name="projectImageId" value={projectImage} /> 

         
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="w-full space-y-3">
                <Input
                  id="projectName"
                  type="text"
                  label="Name"
                  placeholder="Enter Project Name"
                  {...register("project_name")}
                  name="project_name"
                  className={errors.project_name ? "border border-red-500 focus:outline-none" : ""}
                />
                {errors.project_name && (
                  <span className="text-sm text-red-400">
                    {errors.project_name.message}
                  </span>
                )}

                <div className="">
                  <label>Client</label>
                  <Select onValueChange={(value) => setValue("clientId", value) } name="clientId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Client"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Clients</SelectLabel>


                        {/* {clients?.map((client: { id: string; company_name: string }) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.company_name}
                          </SelectItem>
                        ))} */}


                    {clientsDummy.map((data) => (
                      <SelectItem key={data.id} value={data.id}>
                        {data.clients}
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
                <div className="">
                  <label>Team Leader</label>
                  <Select onValueChange={(value) => setValue("team_leader_id", value)} name="team_leader_id">
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
                    name="github_link"
                  className={errors.github_link ? "border border-red-500 focus:outline-none" : ""}
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
                   name="live_link"
                  className={errors.live_link ? "border border-red-500 focus:outline-none" : ""}
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
                  name="project_thumbnail"
                  className={errors.project_thumbnail ? "border border-red-500 focus:outline-none" : ""}
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
              name="summary"
              className={errors.summary ? "border border-red-500 focus:outline-none" : ""}
            />
            {errors.summary && <span className="text-sm text-red-400">{errors.summary.message}</span>}
       
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
          <Button variant="hollow" className="order-2 w-full sm:order-1 sm:w-[130px]" onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                resetForm();
              }}>
            Cancel
          </Button>
          <Button
            disabled={!isValid || isLoading}
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

export default ProjectAddModal


