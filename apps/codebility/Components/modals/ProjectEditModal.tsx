import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { SetStateAction } from "react"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

import { User } from "@/types"
import { Input } from "@codevs/ui/input"
import { Button } from "@/Components/ui/button"
import { API } from "@/lib/constants"
import useToken from "@/hooks/use-token"
import { Textarea } from "@codevs/ui/textarea"
import { IconPlus } from "@/public/assets/svgs"
import { updateProjects } from "@/app/api/projects"
import { useModal } from "@/hooks/use-modal-projects"
import { modals_ProjectModal } from "@/types/components"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@codevs/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select"
import toast from "react-hot-toast"

import { DeleteProjectMembers, InsertTeamLeader, UpdateData } from "@/app/home/projects/actions"
import { ChangeEvent, useState } from "react"
import { useSupabase } from "@codevs/supabase/hooks/use-supabase";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const ProjectEditModal = () => {

  const supabase = useSupabase();

  const { isOpen, onClose, type, data } = useModal()

  const { users , id , thumbnail, client_id , name} = data || {}

  const isModalOpen = isOpen && type === "projectEditModal"

  const [projectImage, setProjectImage] = useState<string | any>()




  const projectSchema = z.object({
    project_name: z.string().min(1, "Project name is required"),
    github_link: z.string().url("Invalid GitHub URL"),
    summary: z.string().min(1, "Summary is required"),
    live_link: z.string().url("Invalid Live URL"),
    project_thumbnail: z.string().optional(),
    clientId: z.string().min(1, "Client is required"),
  });


  const {
    register,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });



  const { token } = useToken()

  const { data: clients }: UseQueryResult<modals_ProjectModal[]> = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) throw error;
      return data;
    },
  })

  const { data: userslist }: UseQueryResult<User[]> = useQuery({
    queryKey: [""],
    queryFn: async () => {
      const { data, error } = await supabase.from('profile').select('*');
      if (error) throw error;
      return data;
    },
  })

  

  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  const [selectedRemoveMembers, setSelectedRemoveMembers] = useState<User[]>([])

  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleMemberSearch = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchQuery(e.target.value)
  }

  const addMember = (member: User) => {
    if (!selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers((prevMembers) => [...prevMembers, member])
    }
  }

  const removeMember = (id: string) => {
    setSelectedMembers((prevMembers) => prevMembers.filter((member) => member.id !== id))
  }

  const addToRemoveMember = (member: User) => {
    if (!selectedRemoveMembers.some((m) => m.id === member.id)) {
      setSelectedRemoveMembers((prevMembers) => [...prevMembers, member])
    }
  }

  const removetoCancelRemoveMember = (id: string) => {
    setSelectedRemoveMembers((prevMembers) => prevMembers.filter((member) => member.id !== id))
  }

 


  const handleUploadProjectThumbnail = async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0]

    if (file) {
      const formData = new FormData()
      formData.append("image", file)
      const response = await axios.post(`${API.USERS}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const image_url = response.data.data.image_url
      setProjectImage(image_url)
    }
  }



  const handleRemoveProjectThumbnail = () => {
    setProjectImage(null)
  }


  const handleSubmitData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(event.currentTarget);

    try {
      await UpdateData(formData); // Pass form data to DeleteData
      await InsertTeamLeader(formData,selectedMembers)
      await DeleteProjectMembers(formData,selectedRemoveMembers)
      toast.success("New Project has been added!")
      reset();  // Reset the form upon successful submission
      setProjectImage(null);  // Reset the image to default or null
      setSelectedMembers([])
      setSelectedRemoveMembers([])
      onClose(); // Close the modal after successful deletion
    } catch (error) {
      toast.error("Something went wrong!")
    }
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



  const projectUsers = users?.map((projectUser: any) => projectUser.user?.id)
  


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex h-[32rem] w-full max-w-[880px] flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">Edit Project </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmitData} >

        <div className="flex space-x-5">

          <div className="flex flex-col gap-4">
            

      <div className="flex gap-4">
            <div className="flex h-14 w-28 items-center justify-center overflow-hidden rounded-lg bg-gray md:h-20 md:w-40">
              {projectImage ? (
                <Image src={projectImage} width={120} height={120} alt="Project Thumbnail" className="w-full" />
              ) : (
                <Image src={thumbnail ?? ""} width={120} height={120} alt="logo" />
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
                  <p className="cursor-pointer text-violet" onClick={handleRemoveProjectThumbnail}>
                    Remove Image
                  </p>
                )}
              </div>
            </div>
          </div>

          <input type="hidden" name="userId" value={id} /> 
          <input type="hidden" name="projectImageId" value={projectImage} />

            <div className="flex flex-col gap-4">
              <Input
                id="projectName"
                type="text"
                label="Name"
                placeholder={data?.name}
                {...register("project_name")}
                name="project_name"
              />

              <label>Client</label>
              <Select {...register("clientId")} name="clientId" defaultValue={client_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Client" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Clients</SelectLabel>



                    {clientsDummy.map((data) => (
                      <SelectItem key={data.id} value={data.id}>
                        {data.clients}
                      </SelectItem>
                    ))}


                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                id="githubLink"
                type="text"
                label="Github"
                placeholder={data?.github_link}
                {...register("github_link")}
                name="github_link"
              />
              <Input
                id="linkLink"
                type="text"
                label="Live URL"
                placeholder={data?.live_link as string}
                {...register("live_link")}
                  name="live_link"
              />
              <Input
                id="productionLink"
                type="text"
                label="Link"
                placeholder={data?.figma_link as string}
                {...register("project_thumbnail")}
                 name="project_thumbnail"
              />
              <Textarea
                id="summary"
                label="Summary"
                style={{ color: "black" }}
                placeholder={data?.summary}
                {...register("summary")}
                name="summary"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="members">Added Members</label>
            <div className="gap-2">
              <div className="flex flex-wrap items-center">
                {selectedMembers.map((member, index) => (
                  <div
                    className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                    key={`${member.id}_${index}`}
                    onClick={() => removeMember(member.id)}
                  >
                    <Image
                      alt="Avatar"
                      src={member.image_url ?? "/default-avatar.jpg"}
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
                  className="z-10 max-h-[200px] overflow-y-auto rounded-lg bg-white dark:bg-dark-100"
                >
                  <DropdownMenuLabel className="pb-2 text-center text-sm">Add Members</DropdownMenuLabel>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleMemberSearch}
                    placeholder="Search members"
                    className="border-gray-300 mb-2 h-10 w-full rounded-lg border bg-white px-3 text-sm focus:outline-none dark:bg-dark-200"
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="px-4 py-2 text-xs">Available Members</DropdownMenuLabel>
                  {userslist
                    ?.filter(
                      (user: { id: any; first_name: any; last_name: any }) =>
                        !projectUsers?.includes(user.id) &&
                        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user: any) => (
                      <DropdownMenuItem
                        key={user.id}
                        className="hover:bg-gray-100 flex cursor-pointer items-center justify-between px-4 py-2 dark:hover:bg-dark-200"
                        onClick={() => addMember(user)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                            <Image
                              alt="Avatar"
                              src={user.image_url ?? "/default-avatar.jpg"}
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

            {/* ===========remove=========== */}

            <label htmlFor="members">Remove Members</label>
            <div className="gap-2">
              <div className="flex flex-wrap items-center">
                {selectedRemoveMembers.map((member, index) => (
                  <div
                    className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                    key={`${member.id}_${index}`}
                    onClick={() => removetoCancelRemoveMember(member.id)}
                  >
                    <Image
                      alt="Avatar"
                      src={member.image_url ?? "/default-avatar.jpg"}
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
                  className="z-10 max-h-[200px] overflow-y-auto rounded-lg bg-white dark:bg-dark-100"
                >
                  <DropdownMenuLabel className="pb-2 text-center text-sm">Remove Members</DropdownMenuLabel>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleMemberSearch}
                    placeholder="Search members"
                    className="border-gray-300 mb-2 h-10 w-full rounded-lg border bg-white px-3 text-sm focus:outline-none dark:bg-dark-200"
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="px-4 py-2 text-xs">Members</DropdownMenuLabel>
                  {userslist
                    ?.filter((user: { first_name: string; last_name: string }) =>
                      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(( user : User) => {
                      if (!user) return null

                      return (
                        <DropdownMenuItem
                          key={user.id}
                          className="hover:bg-gray-100 flex cursor-pointer items-center justify-between px-4 py-2 dark:hover:bg-dark-200"
                          onClick={() => addToRemoveMember(user)}
                        >
                          <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                              <Image
                                alt="Avatar"
                                src={user.image_url ?? "/default-avatar.jpg"}
                                fill
                                title={`${user.id}'s Avatar`}
                                className="h-auto w-full rounded-full bg-cover object-cover"
                                loading="eager"
                              />
                            </div>
                            <span>{`${user.first_name} ${user.last_name}`}</span>
                          </div>
                        </DropdownMenuItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-4 lg:flex-row">
          <Button variant="hollow" className="order-2 w-full sm:order-1 sm:w-[130px]" onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                onClose();
              }}>
            Cancel
          </Button>
          <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]" type="submit">
            Update
          </Button>


        </DialogFooter>

        </form>


      </DialogContent>
    </Dialog>
  )
}

export default ProjectEditModal
