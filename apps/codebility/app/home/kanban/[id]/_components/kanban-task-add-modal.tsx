"use client"

import React from "react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import { Textarea } from "@codevs/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectItemText } from "@radix-ui/react-select"

import { IconAdd, IconClose, IconDropdown, IconPlus } from "@/public/assets/svgs"
import { useEffect, useState } from "react"
import { taskPrioLevels, taskTypes } from "@/constants"
import { User } from "@/types"
import axios from "axios"
import { API } from "@/lib/constants"
import useToken from "@/hooks/use-token"
import toast from "react-hot-toast"
import { createTaskonList } from "@/app/api/kanban"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import { useFetchEnum } from "@/app/home/_hooks/supabase/use-fetch-enum"

interface AddedMember {
  id?: string
  image_url?: string | null
  last_name?: string
  first_name?: string
}

interface inputTask {
  // id: string
  selectedPrioLevel: string | null
  selectedCategory: string | null
  selectedType: string | null
  title: string
  description: string
  duration: number
  points: number
  addedMembers: AddedMember[]
}

interface Props {
  listName: string;
}

export default function KanbanTaskAddModal({ listName }: Props) {
  const { isOpen, onClose, type, data, dataObject } = useModal()
  /* const [inputTask, setInputTask] = useState<inputTask>({
    selectedPrioLevel: null,
    selectedCategory: null,
    selectedType: null,
    title: "",
    description: "",
    duration: 0,
    points: 0,
    addedMembers: [],
  }) */
  const { token } = useToken()
  const projectId = data

  const { data: categories } = useFetchEnum("public","taskcategory");

 /*  const addMember = (member: User) => {
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

  const handleSave = async () => {
    if (inputTask.title === "") {
      toast.error("Title is Empty")
      return
    }
    if (inputTask.description === "") {
      toast.error("Description is Empty")
      return
    }
    if (!inputTask.selectedPrioLevel) {
      toast.error("Prio Level is not set")
      return
    }
    if (isNaN(Number(inputTask.duration)) || Number(inputTask.duration) <= 0) {
      toast.error("Invalid duration")
      return
    }

    const listId = dataObject?.listId

    let updatedData = {
      title: inputTask.title,
      task_type: inputTask.selectedType,
      task_points: Number(inputTask.points),
      prio_level: inputTask.selectedPrioLevel?.toUpperCase(),
      duration: Number(inputTask.duration),
      task_category: inputTask.selectedCategory,
      full_description: inputTask.description,
      userTaskId: selectedMembers.map((member) => ({ id: member.id })),
      projectId: projectId,
      listId: listId,
    }

    try {
      const response = await createTaskonList(updatedData, token, listId)

      if (response.status == 201) {
        onClose()
        toast.success("Tasks Added")
        setInputTask({ ...inputTask, addedMembers: [] })
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const handleClose = () => {
    setInputTask({ ...inputTask, addedMembers: [], duration: 0, points: 0 })
    onClose()
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
 */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 hover:bg-black-400/40"
        >
          <p className="text-2xl">+</p>
          <p>Add a card</p>
        </button>
      </DialogTrigger>
      <DialogContent
        hideCloseButton={true}
        className="background-lightsection_darksection text-dark100_light900 flex h-[32rem] w-full max-w-3xl flex-col justify-items-center gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Task Name</Label>
            <Input
              id="title"
              name="title"
              className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
              placeholder="Enter Task Name"
            />
            <div className="flex gap-1">
              <Label>in list</Label>
              <Label className="underline">{listName}</Label>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-1/2 gap-4">
              <div className="flex w-1/3 flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category">
                  <SelectTrigger
                    aria-label="Category"
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
                      {categories && categories.map((category: string, i: number) => (
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
              </div>
              <div className="flex w-1/3 flex-col gap-2">
                <Label htmlFor="duration">Duration hrs</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  step="0.25"
                  isKeyboard={true}
                  className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                />
              </div>
              <div className="flex w-1/3 flex-col gap-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                />
              </div>
            </div>
            <div className="flex w-1/2 gap-4">
              <div className="flex w-1/2 flex-col gap-2">
                <Label htmlFor="priority">Priority Level</Label>
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
              </div>
              <div className="flex w-1/2 flex-col gap-2">
                <Label htmlFor="type">Type</Label>
                <Select>
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
                        <SelectItem key={i} className="cursor-default px-3 py-2 text-sm hover:bg-blue-100" value={type}>
                          <SelectItemText>
                            {type}
                          </SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              variant="ghost"
             /*  onChange={handleChangeDescription} */
              className="h-[8rem] resize-none text-sm dark:bg-dark-200"
              placeholder="Add a more detailed description..."
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row">
          <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]" /* onClick={handleSave} */>
            Save
          </Button>
        </DialogFooter>
        <div>
          <DialogClose asChild>
            <button className="absolute right-4 top-4">
              <IconClose className="h-5 invert dark:invert-0" />
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
