"use client"

import React from "react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import { Textarea } from "@codevs/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@radix-ui/react-select"

import { IconClose, IconDropdown, IconPlus, IconCopy } from "@/public/assets/svgs"
import { useEffect, useState } from "react"
import { taskPrioLevels, categories, taskTypes } from "@/constants"
import { User } from "@/types"
import axios from "axios"
import { API } from "@/lib/constants"
import toast from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import useToken from "@/hooks/use-token"
import { updateTask } from "@/app/api/kanban"

interface AddedMember {
  id?: string
  image_url?: string | null
  last_name?: string
  first_name?: string
}

interface inputTask {
  id: string
  selectedPrioLevel: string | null
  selectedCategory: string | null
  selectedType: string | null
  title: string
  description: string
  duration: number
  points: number
  addedMembers: AddedMember[]
  PRLink: string
}

const TaskViewEditModal = () => {
  const defaultAvatar = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
  const { isOpen, onClose, type, data, dataObject } = useModal()
  const projectId = data

  const [inputTask, setInputTask] = useState<inputTask>({
    id: "",
    selectedPrioLevel: "",
    selectedCategory: "",
    selectedType: "",
    title: "",
    description: "",
    duration: 0,
    points: 0,
    addedMembers: [],
    PRLink: "",
  })

  const [isEditing, setIsEditing] = useState(false)

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])
  const [members, setMembers] = useState<User[]>([])
  const { token } = useToken()

  const addMember = (member: User) => {
    setSelectedMembers((prevMembers) => [...prevMembers, member])
    setInputTask((prevInputTask) => ({
      ...prevInputTask,
      addedMembers: [...prevInputTask.addedMembers, member],
    }))
  }

  const removeMember = (id: string) => {
    setSelectedMembers((prevMembers) => prevMembers.filter((member) => member.id !== id))
    setInputTask((prevInputTask) => ({
      ...prevInputTask,
      addedMembers: prevInputTask.addedMembers.filter((member) => member.id !== id),
    }))
  }

  const handleTitleChange = (e: any) => {
    setInputTask({ ...inputTask, title: e.target.value })
  }

  const handleDurationChange = (e: any) => {
    e.preventDefault()
    setInputTask({ ...inputTask, duration: e.target.value })
  }

  const handlePointsChange = (e: any) => {
    e.preventDefault()
    setInputTask({ ...inputTask, points: e.target.value })
  }

  const handleChangeDescription = (e: any) => {
    setInputTask({ ...inputTask, description: e.target.value })
  }

  const handlePRLinkChange = (e: any) => {
    setInputTask({ ...inputTask, PRLink: e.target.value })
  }

  const handleSave = async () => {
    const listId = dataObject?.listId

    let updatedData = {
      id: dataObject.id,
      title: inputTask.title || dataObject,
      task_type: inputTask.selectedType || dataObject.task_type,
      task_points: Number(inputTask.points) || dataObject.task_points,
      prio_level: inputTask.selectedPrioLevel?.toUpperCase() || dataObject.prio_level,
      duration: Number(inputTask.duration) || dataObject.duration,
      task_category: inputTask.selectedCategory || dataObject.task_category,
      pr_link: inputTask.PRLink || dataObject.pr_link,
      full_description: inputTask.description || dataObject.full_description,
      userTaskId: selectedMembers.map((member) => ({ id: member.id })),
      projectId: projectId,
      listId: listId,
    }

    try {
      const response = await updateTask(updatedData, token)

      if (response.status === 200) {
        toast.success("Tasks Added")
        setInputTask({ ...inputTask, addedMembers: [] })
        onClose()
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const listId = dataObject?.listId
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API.TASKS}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const newData = {
        currentListId: listId,
        todoOnBoard: [{ todoBoardId: id }],
      }

      const response = await axios.put(`${API.BOARDS}/update-todo`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      onClose()

      return response.data
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
    onClose()
  }

  const handleClose = () => {
    setIsEditing(false)
    onClose()
  }

  function getLastParameter(url = "") {
    if (url) {
      const lastSlashIndex = url.lastIndexOf("/")
      return url.substring(lastSlashIndex + 1)
    }
  }

  const pr_link: any = getLastParameter(dataObject?.pr_link)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  const handleCopy = () => {
    copyToClipboard(pr_link)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios(API.USERS)
        if (!response) {
          throw new Error("Failed to fetch data from the server.")
        }
        setMembers(response.data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUsers()
  }, [])

  const isModalOpen = isOpen && type === "taskViewEditModal"

  return (
    <Dialog open={isModalOpen}>
      <DialogContent
        hasButton
        className="background-lightsection_darksection flex h-[32rem] w-full max-w-3xl flex-col justify-items-center gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="title">Task Number</Label>
              <div className="border-light_dark flex items-center justify-between rounded border bg-transparent p-1 text-center text-xs focus:outline-none dark:bg-dark-200">
                #{}
              </div>
            </div>
            <Input
              id="title"
              onChange={handleTitleChange}
              className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
              value={inputTask.title}
              placeholder={dataObject?.title}
              disabled={!isEditing}
            />
            <div className="flex gap-1">
              <Label>in list</Label>
              <Label className="underline"></Label>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-1/2 gap-4">
              <div className="flex w-1/3 flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                {isEditing ? (
                  <Select onValueChange={(value) => setInputTask({ ...inputTask, selectedCategory: value })}>
                    <SelectTrigger
                      aria-label="Category"
                      className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200"
                    >
                      <SelectValue placeholder={inputTask.selectedCategory} className="text-sm">
                        {inputTask.selectedCategory}
                      </SelectValue>
                      <IconDropdown className="h-5 invert dark:invert-0" />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="border-light_dark z-10 rounded-md border bg-[#FFF] dark:bg-black-100"
                    >
                      <SelectGroup>
                        {categories.map((category, i) => (
                          <SelectItem
                            key={i}
                            className="cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                            value={category}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                    {dataObject?.task_category}
                  </div>
                )}
              </div>

              {isEditing ? (
                <>
                  <div className="flex w-1/3 flex-col gap-2">
                    <Label htmlFor="duration">Duration hrs</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      step="0.25"
                      value={inputTask.duration}
                      isKeyboard={true}
                      onChange={handleDurationChange}
                      disabled={!isEditing}
                      className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                    />
                  </div>
                  <div className="flex w-1/3 flex-col gap-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="0"
                      value={inputTask.points}
                      onChange={handlePointsChange}
                      disabled={!isEditing}
                      className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex w-1/3 flex-col gap-2">
                    <Label htmlFor="duration">Duration hrs</Label>
                    <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                      {dataObject?.duration}
                    </div>
                  </div>
                  <div className="flex w-1/3 flex-col gap-2">
                    <Label htmlFor="points">Points</Label>
                    <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                      {dataObject?.task_points}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex w-1/2 gap-4">
              <div className="flex w-1/2 flex-col gap-2">
                <Label htmlFor="priority">Priority Level</Label>
                {isEditing ? (
                  <Select onValueChange={(value) => setInputTask({ ...inputTask, selectedPrioLevel: value })}>
                    <SelectTrigger
                      aria-label="Priority Level"
                      className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200"
                    >
                      <SelectValue placeholder={inputTask.selectedPrioLevel} className="text-sm">
                        {inputTask.selectedPrioLevel}
                      </SelectValue>
                      <IconDropdown className="h-5 invert dark:invert-0" />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="border-light_dark z-10 rounded-md border bg-[#FFF] dark:bg-black-100"
                    >
                      <SelectGroup>
                        {taskPrioLevels.map((prioLevel, i) => (
                          <SelectItem
                            key={i}
                            className="cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                            value={prioLevel}
                          >
                            {prioLevel}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                    {dataObject?.prio_level}
                  </div>
                )}
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                {isEditing ? (
                  <Select onValueChange={(value) => setInputTask({ ...inputTask, selectedType: value })}>
                    <SelectTrigger
                      aria-label="Type"
                      className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200"
                    >
                      <SelectValue placeholder={inputTask.selectedType} className="text-sm">
                        {inputTask.selectedType}
                      </SelectValue>
                      <IconDropdown className="h-5 invert dark:invert-0" />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="border-light_dark z-10 rounded-md border bg-[#FFF] dark:bg-black-100"
                    >
                      <SelectGroup>
                        {taskTypes.map((type, i) => (
                          <SelectItem
                            key={i}
                            className="cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                    {dataObject?.task_type}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="members">Members</label>
            <div className="flex gap-2">
              <div className="flex flex-wrap items-center gap-x-0.5">
                {isEditing ? (
                  <>
                    {selectedMembers.map((member, index) => (
                      <div
                        className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                        key={`${member.id}_${index}`}
                        onClick={() => removeMember(member.id)}
                      >
                        <Image
                          alt="Avatar"
                          src={member.image_url ?? defaultAvatar}
                          fill
                          title={`${member.first_name} ${member.last_name}'s Avatar`}
                          className="h-auto w-full rounded-full bg-cover object-cover"
                          loading="eager"
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {dataObject?.userTask?.map((users: User) => (
                      <div
                        className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                        key={`${users.id}`}
                      >
                        <Image
                          alt="Avatar"
                          src={users.image_url ?? defaultAvatar}
                          fill
                          title={`${users.first_name} ${users.last_name}'s Avatar`}
                          className="h-auto w-full rounded-full bg-cover object-cover"
                          loading="eager"
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer" asChild>
                  {isEditing ? (
                    <Button variant="hollow" className="h-12 w-12 rounded-full p-0">
                      <IconPlus className="invert dark:invert-0" />
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="bottom"
                  sideOffset={10}
                  align="start"
                  className="z-10 max-h-[200px] overflow-y-auto bg-white dark:bg-dark-100"
                >
                  <DropdownMenuLabel className="pb-2 text-center text-sm">Add Members</DropdownMenuLabel>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search members"
                    className="border-gray-300 mb-2 h-10 w-full rounded-lg border bg-white px-3 text-sm focus:outline-none dark:bg-dark-200"
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="px-4 py-2 text-xs">Available Members</DropdownMenuLabel>

                  {members
                    ?.filter((user) =>
                      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user) => (
                      <DropdownMenuItem
                        key={user.id}
                        className="hover:bg-gray-100 flex cursor-pointer items-center justify-between px-4 py-2 dark:hover:bg-dark-200"
                        onClick={() => addMember(user)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative h-8 w-8 rounded-full bg-cover object-cover">
                            <Image
                              alt="Avatar"
                              src={user.image_url ?? defaultAvatar}
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

          <div className="flex flex-col gap-1">
            <Label htmlFor="desc">Description</Label>
            {isEditing ? (
              <Textarea
                id="desc"
                variant="ghost"
                onChange={handleChangeDescription}
                className="h-[8rem] resize-none dark:bg-dark-200"
                value={inputTask.description}
              />
            ) : (
              <div className="border-light_dark h-[8rem] w-full resize-none rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200">
                {dataObject?.full_description}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Branch Name</Label>
          <div className="flex gap-2">
            <div className="border-light_dark rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200">
              {pr_link}
            </div>
            <button onClick={handleCopy}>
              <IconCopy className="h-5 invert dark:invert-0" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Pull Request Link</Label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                id="title"
                onChange={handlePRLinkChange}
                className="border-light_dark w-2/3 rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                placeholder="Enter Pull Request Link"
                value={inputTask.PRLink}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                id="title"
                disabled
                className="border-light_dark w-2/3 rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                value={dataObject?.pr_link}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row">
          {isEditing ? (
            <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]" onClick={handleSave}>
              Save Update
            </Button>
          ) : (
            <>
              {" "}
              <Button
                variant="destructive"
                className="order-1 w-full sm:order-2 sm:w-[130px]"
                onClick={() => handleDelete(dataObject?.id)}
              >
                Delete
              </Button>
              <Button
                variant="hollow"
                className="order-1 w-full sm:order-2 sm:w-[130px]"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </>
          )}
        </DialogFooter>

        <div>
          <button onClick={handleClose} className="absolute right-4 top-4">
            <IconClose className="h-5 invert dark:invert-0" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskViewEditModal
