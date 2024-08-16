import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { SetStateAction, useState } from "react"
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

const ProjectEditModal = () => {
  const { isOpen, onClose, type, data } = useModal()

  const { users } = data || {}

  const isModalOpen = isOpen && type === "projectEditModal"

  const [formData, setFormData] = useState({
    project_name: "",
    github_link: "",
    summary: "",
    live_link: "",
    project_thumbnail: "",
    clientId: "",
  })

  const { token } = useToken()

  const { data: clients }: UseQueryResult<modals_ProjectModal[]> = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await axios(API.CLIENTS)
      return response.data.data
    },
  })

  const { data: userslist }: UseQueryResult<User[]> = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios(API.USERS)
      return response.data.data
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

  const handleSubmit = async () => {
    try {
      const response = await updateProjects(
        {
          ...formData,
        },
        data?.id as string,
        selectedMembers.map((member) => ({ id: member.id })),
        selectedRemoveMembers?.map((member) => ({ id: member.id })),
        token
      )
      if (response.status === 201) {
        onClose()
        toast.success("Project has been updated!")
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const projectUsers = users?.map((projectUser: any) => projectUser.user?.id)

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        hasButton
        className="flex h-[32rem] w-full max-w-[880px] flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-xl">Edit Project</DialogTitle>
        </DialogHeader>

        <div className="flex space-x-5">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex h-14 w-28 items-center justify-center rounded-lg bg-gray md:h-20 md:w-40">
                <Image src="/assets/svgs/icon-cog.svg" width={30} height={30} alt="logo" />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <p className="text-md text-gray">Image size 1080 x 768 px</p>
                <div className="flex gap-4">
                  <Link href={`#`}>
                    <p className="text-blue-100">Upload Image</p>
                  </Link>
                  <Link href={`#`}>
                    <p className="text-violet">Remove Image</p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Input
                id="projectName"
                type="text"
                label="Name"
                placeholder={data?.project_name}
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              />

              <label>Client</label>
              <Select onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Client" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Clients</SelectLabel>
                    {clients?.map((client: { id: string; company_name: string }) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Input
                id="githubLink"
                type="text"
                label="Github"
                required
                placeholder={data?.github_link}
                value={formData.github_link}
                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
              />
              <Input
                id="linkLink"
                type="text"
                label="Live URL"
                required
                placeholder={data?.live_link as string}
                value={formData.live_link}
                onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
              />
              <Input
                id="productionLink"
                type="text"
                label="Link"
                required
                placeholder={data?.project_thumbnail as string}
                value={formData.project_thumbnail}
                onChange={(e) => setFormData({ ...formData, project_thumbnail: e.target.value })}
              />
              <Textarea
                id="summary"
                label="Summary"
                required
                style={{ color: "black" }}
                placeholder={data?.summary}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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
                  {users
                    ?.filter((user: { first_name: string; last_name: string }) =>
                      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(({ user }: any) => {
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
          <Button variant="hollow" className="order-2 w-full sm:order-1 sm:w-[130px]" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]" onClick={handleSubmit}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectEditModal
