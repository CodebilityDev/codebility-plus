"use client"

import React from "react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import { useState } from "react"
import useToken from "@/hooks/use-token"
import toast from "react-hot-toast"
import { createListonBoard } from "@/app/api/kanban"

const ListAddModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const [newList, setNewList] = useState({
    name: "",
    boardId: "",
  })
  const { token } = useToken()

  const handleNameChange = (e: any) => {
    setNewList({ ...newList, name: e.target.value, boardId: data as string })
  }

  const handleSave = async () => {
    if (newList.name === "") {
      toast.error("Name is Empty")
      return
    }

    try {
      const response = await createListonBoard(newList, token)
      if (response.status === 201) {
        toast.success("List Added")
        onClose()
      }
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const handleClose = () => {
    setNewList({ ...newList, name: "" })
    onClose()
  }

  const isModalOpen = isOpen && type === "listAddModal"

  return (
    <Dialog open={isModalOpen}>
      <DialogContent
        hasButton
        className="flex h-auto w-[100%] max-w-3xl flex-col gap-6 overflow-x-auto overflow-y-auto"
      >
        <DialogHeader className="relative">
          <DialogTitle className="mb-2 text-left text-lg">Add New List</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex basis-[50%] flex-col gap-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" onChange={handleNameChange} />
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

export default ListAddModal
