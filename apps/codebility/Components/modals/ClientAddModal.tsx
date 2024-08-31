import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@codevs/ui/input"
import { Button } from "@/Components/ui/button"
import { IconClose } from "@/public/assets/svgs"
import { useModal } from "@/hooks/use-modal-clients"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog"
import { ClientFormValues, clientSchema } from "@/app/home/clients/_lib/schema"
import toast from "react-hot-toast"
import { createClientAction } from "@/app/home/clients/action"
import { DEFAULT_AVATAR } from "@/app/home/clients/_lib/constants"

const ClientAddModal = () => {
  const { isOpen, onClose, type } = useModal()
  const isModalOpen = isOpen && type === "clientAddModal"

  const [isLoading, setIsLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  })

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onClose();
  }

  const handleCreateClient = async (data: ClientFormValues) => { 
    setIsLoading(true);

    try {
      const response = await createClientAction(data);

      if (response.success) {
        toast.success("Client created successfully");
        handleDialogChange(false);
      } else {
        toast.error(`Error: ${response.error}`);
      }
    } catch (error) {
      console.log("Error creating new client: ", error);
      toast.error("Error creating new client");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <button onClick={() => handleDialogChange(false)} className="absolute right-4 top-4">
          <IconClose />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Company</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center md:justify-start">
            <label className="md:text-md text-sm lg:text-lg">Logo</label>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative mx-auto flex size-[100px] md:mx-0 md:size-[80px]">
              <Image
                src={companyLogo || DEFAULT_AVATAR}
                id="image"
                alt="Avatar"
                fill
                className="h-auto w-auto rounded-full bg-dark-400 bg-cover object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-2">
              <p className="text-md text-gray text-center">Image size 1080 x 768 px</p>
              <div className="gap-4">
                <div className="relative">
                  {!companyLogo && <label htmlFor="companylogo">
                    <p className="cursor-pointer text-center text-blue-100 md:text-left">Upload Image</p>
                  </label>}
                  <input id="companylogo" type="file" className="hidden" />
                  {/* <input type="hidden" name="avatar" value={companyLogo} /> */}
                </div>
                {companyLogo && <p className="cursor-pointer text-center text-violet md:text-left">
                  Remove Image
                </p>}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleCreateClient)}>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <Input
                variant="lightgray"
                label="Name"
                placeholder="Enter Company Name"
                {...register("name")}
                className={errors.name ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.name && <span className="text-sm text-red-400">{errors.name.message}</span>}
              <Input
                variant="lightgray"
                label="Email"
                placeholder="Enter Company Email Address"
                type="email"
                {...register("email")}
                className={errors.email ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
              <Input
                variant="lightgray"
                label="Address"
                placeholder="Enter Company Address"
                {...register("location")}
                className={errors.location ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.location && <span className="text-sm text-red-400">{errors.location.message}</span>}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <Input
                variant="lightgray"
                label="Contact Number"
                placeholder="Enter Company Contact Number"
                type="number"
                {...register("contact_number")}
                className={errors.contact_number ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.contact_number && <span className="text-sm text-red-400">{errors.contact_number.message}</span>}
              <Input
                variant="lightgray"
                label="Linkedin"
                placeholder="Enter Company Linkedin Link"
                {...register("linkedin_link")}
                className={errors.linkedin_link ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.linkedin_link && <span className="text-sm text-red-400">{errors.linkedin_link.message}</span>}
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="w-full">
                  <Input
                    variant="lightgray"
                    label="Start Time"
                    placeholder="Enter Start Time"
                    type="time"
                    {...register("start_time")}
                    className={errors.start_time ? "border border-red-500 focus:outline-none" : ""}
                  />
                  {errors.start_time && (
                    <span className="text-sm text-red-400">{errors.start_time.message}</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    variant="lightgray"
                    label="End Time"
                    placeholder="Enter End Time"
                    type="time"
                    {...register("end_time")}
                    className={errors.end_time ? "border border-red-500 focus:outline-none" : ""}
                  />
                  {errors.end_time && (
                    <span className="text-sm text-red-400">{errors.end_time.message}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={() => handleDialogChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="order-1 w-full sm:order-2 sm:w-[130px]" disabled={isLoading}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ClientAddModal
