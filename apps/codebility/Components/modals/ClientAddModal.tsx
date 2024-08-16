import * as z from "zod"
import axios from "axios"
import Image from "next/image"
import toast from "react-hot-toast"
import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@codevs/ui/input"
import { Button } from "@/Components/ui/button"
import { API } from "@/lib/constants"
import useToken from "@/hooks/use-token"
import { createClient } from "@/app/api/clients"
import { IconClose } from "@/public/assets/svgs"
import { useModal } from "@/hooks/use-modal-clients"
import { DialogTitle } from "@radix-ui/react-dialog"
import { defaultAvatar } from "@/public/assets/images"
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@codevs/ui/dialog"

const clientSchema = z.object({
  company_name: z.string().min(1, { message: "Company name is required" }),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, { message: "Location is required" }),
  contact_number: z.string().min(1, { message: "Contact number is required" }),
  linkedin_link: z.string().url("Invalid URL"),
  client_start_time: z.string().min(1, { message: "Start time is required" }),
  client_end_time: z.string().min(1, { message: "End time is required" }),
})

type ClientFormValues = z.infer<typeof clientSchema>

const ClientAddModal = () => {
  const { token } = useToken()
  const { isOpen, onClose, type } = useModal()
  const isModalOpen = isOpen && type === "clientAddModal"
  const [isLoading, setIsLoading] = useState(false)
  const [companyLogo, setCompanyLogo] = useState<string | any>()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  })

  const handleUploadCompanyLogo = async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0]

    if (file) {
      const formData = new FormData()
      formData.append("image", file)
      const response = await axios.post(`${API.USERS}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const image_url = response.data.data.image_url
      setCompanyLogo(image_url)
    }
  }

  const handleRemoveCompanyLogo = () => {
    setCompanyLogo(defaultAvatar.src as string)
  }

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      reset()
      setCompanyLogo(defaultAvatar.src as string)
    }
    onClose()
  }

  useEffect(() => {
    setCompanyLogo(defaultAvatar.src as string)
  }, [])

  const ClientAddModal = async (data: ClientFormValues) => {
    setIsLoading(true)

    try {
      const response = await createClient(
        {
          ...data,
          company_logo: companyLogo,
          statusType: "ACTIVE",
        },
        token
      )
      if (response.status === 201) {
        handleDialogChange(false)
        toast.success("New Client has been Added!")
      }
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
      <DialogContent
        hasButton
        className="flex h-[32rem] w-[90%] max-w-4xl flex-col gap-6 overflow-x-auto overflow-y-auto lg:h-auto"
      >
        <button onClick={() => handleDialogChange(false)} className="absolute right-4 top-4">
          <IconClose />
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Company</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center xs:justify-start">
            <label className="md:text-md text-sm lg:text-lg">Logo</label>
          </div>
          <div className="flex flex-col gap-4 xs:flex-row">
            <div className="relative mx-auto flex size-[100px] xs:mx-0 xs:size-[80px]">
              <Image
                src={companyLogo}
                id="image"
                alt="Avatar"
                fill
                className="h-auto w-auto rounded-full bg-dark-400 bg-cover object-cover"
              />
            </div>

            <div className="flex flex-col justify-center gap-2">
              <p className="text-md text-gray">Image size 1080 x 768 px</p>
              <div className="gap-4">
                <div className="relative">
                  <label htmlFor="companylogo">
                    {companyLogo === defaultAvatar.src && (
                      <p className="cursor-pointer text-center text-blue-100 xs:text-left">Upload Image</p>
                    )}
                  </label>
                  <input onChange={handleUploadCompanyLogo} id="companylogo" type="file" className="hidden" />
                  <input type="hidden" name="avatar" value={companyLogo} />
                </div>
                {companyLogo !== defaultAvatar.src && (
                  <p className="cursor-pointer text-center text-violet xs:text-left" onClick={handleRemoveCompanyLogo}>
                    Remove Image
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(ClientAddModal)}>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              <Input
                label="Name"
                placeholder="Enter Company Name"
                {...register("company_name")}
                className={errors.company_name ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.company_name && <span className="text-sm text-red-400">{errors.company_name.message}</span>}
              <Input
                label="Email"
                placeholder="Enter Company Email Address"
                type="email"
                {...register("email")}
                className={errors.email ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
              <Input
                label="Address"
                placeholder="Enter Company Address"
                {...register("location")}
                className={errors.location ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.location && <span className="text-sm text-red-400">{errors.location.message}</span>}
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <Input
                label="Contact Number"
                placeholder="Enter Company Contact Number"
                type="number"
                {...register("contact_number")}
                className={errors.contact_number ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.contact_number && <span className="text-sm text-red-400">{errors.contact_number.message}</span>}
              <Input
                label="Linkedin"
                placeholder="Enter Company Linkedin Link"
                {...register("linkedin_link")}
                className={errors.linkedin_link ? "border border-red-500 focus:outline-none" : ""}
              />
              {errors.linkedin_link && <span className="text-sm text-red-400">{errors.linkedin_link.message}</span>}
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="w-full">
                  <Input
                    label="Start Time"
                    placeholder="Enter Start Time"
                    type="time"
                    {...register("client_start_time")}
                    className={errors.client_start_time ? "border border-red-500 focus:outline-none" : ""}
                  />
                  {errors.client_start_time && (
                    <span className="text-sm text-red-400">{errors.client_start_time.message}</span>
                  )}
                </div>
                <div className="w-full">
                  <Input
                    label="End Time"
                    placeholder="Enter End Time"
                    type="time"
                    {...register("client_end_time")}
                    className={errors.client_end_time ? "border border-red-500 focus:outline-none" : ""}
                  />
                  {errors.client_end_time && (
                    <span className="text-sm text-red-400">{errors.client_end_time.message}</span>
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
            >
              Cancel
            </Button>
            <Button type="submit" className="order-1 w-full sm:order-2 sm:w-[130px]" disabled={!isValid || isLoading}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ClientAddModal
