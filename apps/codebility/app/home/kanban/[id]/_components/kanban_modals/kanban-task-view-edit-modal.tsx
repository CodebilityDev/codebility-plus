"use client"

import React from "react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@codevs/ui/dialog"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import { Textarea } from "@codevs/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectItemText } from "@radix-ui/react-select"
import { IconClose, IconDropdown, IconCopy } from "@/public/assets/svgs"
import { useState } from "react"
import { taskPrioLevels, categories, taskTypes } from "@/constants"
import { User } from "@/types"
import toast from "react-hot-toast"
import Image from "next/image"
import { deleteTask, updateTask } from "../../actions"
import { Task } from "@/types/home/task"
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog"
import KanbanAddModalMembers from "./kanban-add-modal-members"
import { getTaskMembers } from "../../_lib/get-task-members"
import { useRouter } from "next/navigation"


interface Props {
  children: React.ReactNode;
  task: Task;
}

export default function KanbanTaskViewEditModal({ children, task }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const title = formData.get("title");
      if (!title) formData.set("title", task.title);

      await updateTask(formData, task);
      toast.success("Update Success!");
      setIsEditing(false);
      router.refresh(); // reflect updated task.
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast.success("Task Deleted!");
      router.refresh(); // reflect updated task.
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent
        hideCloseButton={true}
        className="background-lightsection_darksection text-dark100_light900 h-[32rem] w-full max-w-3xl overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <form className="flex flex-col justify-items-center gap-6 px-4 py-2" action={handleSubmit}>
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
                name="title"
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
                    <Select defaultValue={task.category} name="category">
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
                        name="duration"
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
                        id="points"
                        name="points"
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
                    <Select name="priority" defaultValue={task.priority_level}>
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
                              value={prioLevel.toUpperCase()}
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
                      {task.priority_level.charAt(0) + task.priority_level.slice(1).toLowerCase()} {/** capitalize */}
                    </div>
                  )}
                </div>
                <div className="flex w-1/2 flex-col gap-2">
                  <Label htmlFor="type">Type</Label>
                  {isEditing ? (
                    <Select defaultValue={task.type} name="type">
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
            <div className="flex flex-wrap items-center gap-x-0.5">
              {
                isEditing ? (
                  <KanbanAddModalMembers initialSelectedMembers={getTaskMembers(task.codev_task)}/>
                )
                :
                (
                  <>
                    {(getTaskMembers(task.codev_task)).map((users: User) => (
                      <div
                        className="relative h-12 w-12 cursor-pointer rounded-full bg-cover object-cover"
                        key={`${users.id}`}
                      >
                        <Image
                          alt="Avatar"
                          src={users.image_url as string}
                          fill
                          title={`${users.first_name} ${users.last_name}'s Avatar`}
                          className="h-auto w-full rounded-full bg-cover object-cover"
                          loading="eager"
                        />
                      </div>
                    ))}
                  </>
                )
              }
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="description" >Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  name="description"
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
                  name="pr_link"
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
                  type="button"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="hollow"
                  className="order-1 w-full sm:order-2 sm:w-[130px]"
                  type="button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </>
            )}
          </DialogFooter>

          <div>
            <DialogClose asChild>
              <button className="absolute right-4 top-4" onClick={() => setIsEditing(false)}>
                <IconClose className="h-5 invert dark:invert-0" />
              </button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
