"use client"
import React from "react"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@radix-ui/react-select"
import { ProjectT } from "@/types"
import { Label } from "@codevs/ui/label"
import toast from "react-hot-toast"
import Input from "@/Components/ui/forms/input"
import { createBoard } from "@/app/api/kanban"
import useToken from "@/hooks/use-token"
import { useModal } from "@/hooks/use-modal"
import { getProjects } from "@/app/api/projects"
import { useEffect, useState } from "react"
import { Button } from "@/Components/ui/button"
import { IconDropdown } from "@/public/assets/svgs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@codevs/ui/dialog"

const BoardAddModal = () => {
  const { isOpen, onClose, type } = useModal()
  const [projects, setProjects] = useState<ProjectT[]>([])
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null)
  const [newBoard, setNewBoard] = useState({
    name: "",
    projects: [{ projectsId: "" }],
  })
  const { token } = useToken()

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getProjects()
      setProjects(projects)
    }

    fetchProjects()
  }, [])

  const handleNameChange = (e: any) => {
    setNewBoard({ ...newBoard, name: e.target.value })
  }

  const handleValueChange = (value: string) => {
    setNewBoard({ ...newBoard, projects: [{ projectsId: value }] })
    projects.forEach((proj) => {
      if (proj.id === value) {
        setSelectedProjectName(proj.project_name as string)
      }
    })
  }

  const handleSave = async () => {
    if (newBoard.name === "") {
      toast.error("Name is Empty")
      return
    }

    try {
      const response = await createBoard(newBoard, token)
      if (response.status === 201) {
        toast.success("Board Added")
        onClose()
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const handleClose = () => {
    setNewBoard({
      name: "",
      projects: [{ projectsId: "" }],
    })
    onClose()
  }

  const isModalOpen = isOpen && type === "boardAddModal"

  return (
    <Dialog open={isModalOpen}>
      <DialogContent
        hasButton
        className="flex h-auto w-[100%] max-w-3xl flex-col gap-6 overflow-x-auto overflow-y-auto"
      >
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-lg">Add New Board</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex basis-[50%] flex-col gap-4">
            <div>
              <Label>Project</Label>
              <Select onValueChange={(value) => handleValueChange(value)}>
                <SelectTrigger
                  aria-label="Projects"
                  className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none"
                >
                  <SelectValue className="text-sm" placeholder="Select a Project">
                    {selectedProjectName}
                  </SelectValue>
                  <IconDropdown className="invert dark:invert-0" />
                </SelectTrigger>

                <SelectContent className="border-light_dark rounded-md border bg-[#FFF] dark:bg-black-100">
                  <SelectGroup>
                    <SelectLabel className="px-3 py-2 text-xs text-gray">Projects</SelectLabel>
                    {projects?.map(({ id, project_name }: ProjectT) => (
                      <SelectItem
                        key={id}
                        className="w-[345px] cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                        value={id as string}
                      >
                        {project_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" onChange={handleNameChange} />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row">
          <Button variant="hollow" className="order-2 w-full sm:order-1 sm:w-[130px]" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BoardAddModal
