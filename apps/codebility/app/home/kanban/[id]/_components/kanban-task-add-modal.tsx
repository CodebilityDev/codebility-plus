"use client"

import React from "react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@codevs/ui/dialog"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import { Textarea } from "@codevs/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectItemText } from "@radix-ui/react-select"

import { IconAdd, IconClose, IconDropdown, IconPlus } from "@/public/assets/svgs"
import { taskPrioLevels, taskTypes } from "@/constants"
import toast from "react-hot-toast"
import Image from "next/image"
import { useFetchEnum } from "@/app/home/_hooks/supabase/use-fetch-enum"
import KanbanTaskAddModalMembers from "./kanban-task-add-modal-members"
import { DialogTitle } from "@radix-ui/react-dialog"
import { createNewTask } from "../actions"

interface Props {
  listId: string;
  listName: string;
  projectId: string;
}

export default function KanbanTaskAddModal({ listId, listName, projectId }: Props) {
  const { data: categories } = useFetchEnum("public","taskcategory");

  const validateInput = (formData: FormData) => {
    const inputs: Record<string, any> = {};

    // get all input name and value as key: value pair.
    for (let [key,value] of formData.entries()) inputs[key] = value; 
    
    const required = ["title", "category", "priority", "type"];

    for (let key of formData.keys()) {
      const value = inputs[key];

      // check if required input has value.
      if (required.includes(key) && 
         (value === null || value === undefined || value === "")
         )
          throw new Error(`${key} is required`);
      
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      validateInput(formData);
      
      await createNewTask(formData);
    } catch (e: any) {
      toast.error(e.message)
    }
  }

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
        className="background-lightsection_darksection text-dark100_light900 h-[32rem] w-full max-w-3xl lg:h-auto"
      >
        <form action={handleSubmit} className="flex flex-col justify-items-center gap-6 overflow-x-auto overflow-y-auto">
          <DialogHeader className="relative">
              <DialogTitle className="mb-2 text-left text-lg">Add New Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="listId" value={listId} />
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
                    name="duration"
                    min="0"
                    step="0.25"
                    isKeyboard={true}
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
                    className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
                  />
                </div>
              </div>
              <div className="flex w-1/2 gap-4">
                <div className="flex w-1/2 flex-col gap-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select name="priority">
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
                  <Select name="type">
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
            <KanbanTaskAddModalMembers />
            <div className="flex flex-col gap-1">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                variant="ghost"
                name="description"
                className="h-[8rem] resize-none text-sm dark:bg-dark-200"
                placeholder="Add a more detailed description..."
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]">
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
