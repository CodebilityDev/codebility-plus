"use client"

import React from "react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import { Textarea } from "@codevs/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectItemText } from "@radix-ui/react-select"

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
import { Task } from "@/types/home/task"
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog"
import KanbanAddModalMembers from "./kanban-add-modal-members"
import { getTaskMembers } from "../../_lib/get-task-members"

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

interface Props {
  children: React.ReactNode;
  task: Task;
}

export default function KanbanTaskViewEditModal({ children, task }: Props) {
 /*  const defaultAvatar = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
  const { onClose, type, data, dataObject } = useModal()
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
  })*/

  const [isEditing, setIsEditing] = useState(false)
/*
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
*/
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        className="background-lightsection_darksection text-dark100_light900 h-[32rem] w-full max-w-3xl overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <form className="flex flex-col justify-items-center gap-6 px-4 py-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="title">Task Number</Label>
                <div className="border-light_dark flex items-center justify-between rounded border bg-transparent p-1 text-center text-xs focus:outline-none dark:bg-dark-200">
                  #{task.number}
                </div>
              </div>
              <Input
                id="title"
                className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                placeholder={task.title}
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
                    <Select defaultValue={task.category}>
                      <SelectTrigger
                        aria-label="Category"
                        className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200"
                      >
                        <SelectValue  className="text-sm" />
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
                              <SelectItemText>
                                {category}
                              </SelectItemText>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                      {task.category}
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
                        isKeyboard={true}
                        defaultValue={task.duration}
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
                        defaultValue={task.points}
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
                        {task.duration}
                      </div>
                    </div>
                    <div className="flex w-1/3 flex-col gap-2">
                      <Label htmlFor="points">Points</Label>
                      <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                        {task.points}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex w-1/2 gap-4">
                <div className="flex w-1/2 flex-col gap-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  {isEditing ? (
                    <Select>
                      <SelectTrigger
                        aria-label="Priority Level"
                        className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200"
                      >
                        <SelectValue className="text-sm" />
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
                              <SelectItemText>
                                {prioLevel}
                              </SelectItemText>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                      {task.priority_level}
                    </div>
                  )}
                </div>
                <div className="flex w-1/2 flex-col gap-2">
                  <Label htmlFor="type">Type</Label>
                  {isEditing ? (
                    <Select defaultValue={task.type}>
                      <SelectTrigger
                        aria-label="Type"
                        className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200"
                      >
                        <SelectValue className="text-sm" />
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
                              <SelectItemText>
                                {type}
                              </SelectItemText>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none dark:bg-dark-200">
                      {task.type}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <KanbanAddModalMembers initialSelectedMembers={getTaskMembers(task.codev_task)}/>

            <div className="flex flex-col gap-1">
              <Label htmlFor="desc">Description</Label>
              {isEditing ? (
                <Textarea
                  id="desc"
                  variant="ghost"
                  className="h-[8rem] resize-none dark:bg-dark-200"
                  defaultValue={task.description}
                />
              ) : (
                <div className="border-light_dark h-[8rem] w-full resize-none rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200">
                  {task.description}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Branch Name</Label>
            <div className="flex gap-2">
              <div className="border-light_dark rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200">
                {task.pr_link}
              </div>
              <button type="button" onClick={() => handleCopy(task.pr_link)}>
                <IconCopy className="h-5 invert dark:invert-0" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pr_link">Pull Request Link</Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  id="pr_link"
                  className="border-light_dark w-2/3 rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                  placeholder="Enter Pull Request Link"
                  defaultValue={task.pr_link}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id="pr_link"
                  disabled
                  className="border-light_dark w-2/3 rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                  value={task?.pr_link}
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            {isEditing ? (
              <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]" /* onClick={handleSave} */>
                Save Update
              </Button>
            ) : (
              <>
                {" "}
                <Button
                  variant="destructive"
                  className="order-1 w-full sm:order-2 sm:w-[130px]"
                /*   onClick={() => handleDelete(dataObject?.id)} */
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
            <DialogClose asChild>
              <button className="absolute right-4 top-4">
                <IconClose className="h-5 invert dark:invert-0" />
              </button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
