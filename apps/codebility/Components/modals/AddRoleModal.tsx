"use client"

import React, { useState } from "react"
import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import { IconClose } from "@/public/assets/svgs"
import toast from "react-hot-toast"
// import { createRoles } from "@/app/api/settings"
// import useToken from "@/hooks/use-token"

const AddRoleModal = () => {
  // const { token } = useToken()
  const { isOpen, onClose, type } = useModal()
  const isModalOpen = isOpen && type === "addRoleModal"

  const [newRole, setNewRole] = useState<string>("")

  const handleClose = () => {
    setNewRole("")
    onClose()
  }

  const handleSave = async () => {
    if (!newRole) return toast.error("Name is Empty")

    try {
      // await createRoles({ name: newRole }, token)
      toast.success(`${newRole} role successfully added!`)
      onClose()
    } catch (error) {}
  }

  return (
    <Dialog open={isModalOpen}>
      <DialogContent
        hasButton
        className="background-lightsection_darksection flex h-auto w-[95%] max-w-3xl flex-col justify-items-center gap-6 "
      >
        <div className=" mt-16 flex flex-col  gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none dark:bg-dark-200"
              placeholder=""
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row">
          <Button variant="hollow" className="order-2 w-full sm:order-1 sm:w-[130px]" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="purple" className="order-1 w-full sm:order-2 sm:w-[130px]" onClick={handleSave}>
            Create
          </Button>
        </DialogFooter>
        <div className="lef-0 absolute right-0 top-0 flex w-[100%] flex-row items-center justify-between gap-2 border-b-[1px] border-black-200 px-10 py-3">
          <DialogHeader className=" w-full ">
            <DialogTitle className=" text-left text-lg">Add New Role</DialogTitle>
          </DialogHeader>
          <button onClick={handleClose} className="">
            <IconClose className="h-5 invert dark:invert-0 " />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddRoleModal