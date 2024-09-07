"use client"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"


import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import Box from "@/Components/shared/dashboard/Box"

import InputPhone from "@/Components/shared/dashboard/InputPhone"

import { Input } from "@codevs/ui/input"

import { updateSocial } from "../action"

type Contact = {
  phone_no: string
  portfolio_website: string
  github_link: string
  linkedin_link: string
  fb_link: string
  telegram_link: string
  whatsapp_link: string
  skype_link: string
}
type ContactProps = {
  data: Contact
}
const ContactInfo = ({data}: ContactProps) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
 

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { },
  } = useForm({
    defaultValues: {
      phone_no: "" ,
      portfolio_website: "",
      github_link: "",
      linkedin_link: "",
      fb_link: "",
      telegram_link: "",
      whatsapp_link: "",
      skype_link: "",
    },
   
  })
  

  useEffect(() => {
    if (data) {
      reset({
        phone_no: data.phone_no || "",
        portfolio_website: data.portfolio_website || "",
        github_link: data.github_link || "",
        linkedin_link: data.linkedin_link || "",
        fb_link: data.fb_link || "",
        telegram_link: data.telegram_link || "",
        whatsapp_link: data.whatsapp_link || "",
        skype_link: data.skype_link || ""
      })
    }
  }, [data, reset])

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      const {
        phone_no,
        portfolio_website,
        github_link,
        linkedin_link,
        fb_link,
        telegram_link,
        whatsapp_link,
        skype_link
      } = data;
      await updateSocial({phone_no, portfolio_website, github_link, linkedin_link, fb_link, telegram_link, whatsapp_link, skype_link})
      toast.success("Your contact info was sucessfully updated!")
      setIsEditMode(false)
    } catch(error){
      console.log(error)
      toast.error("Something went wrong, Please try again later!")
    } finally {
      setIsLoading(false)
    }
  }
 

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }
  const handleSaveClick = () => {
    setIsEditMode(false)
  }

  return (
    <Box className="relative flex flex-col gap-6 bg-light-900 dark:bg-dark-100">
      <IconEdit
        className={` ${
          isEditMode ? "hidden" : "w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        }  `}
        onClick={handleEditClick}
      />
      <form className="px-2" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-lg">Contact Info</p>

        <div className="flex flex-col pt-4">
          <InputPhone
            id="phone_no"
            control={control}
            label="eg. 9054936302"
            disabled={!isEditMode}
            inputClassName={` ${
              isEditMode
                ? " border border-lightgray bg-white text-black-100 dark:border-zinc-700 dark:bg-dark-200 dark:text-white"
                : " bg-white  text-dark-200 dark:bg-dark-200 dark:text-gray"
            }`}
          />
          {/* {errors.phone_no?.message && <p className="ml-24 mt-2 text-sm text-red-400">{errors.phone_no?.message}</p>} */}
          <Input
            id="portfolio_website"
            {...register("portfolio_website")}
            label="Website"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
          {/* {errors.portfolio_website?.message && (
            <p className="ml-24 mt-2 text-sm text-red-400">{errors.portfolio_website?.message}</p>
          )} */}
          <Input
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
            id="github_link"
            {...register("github_link")}
            label="Github"
            disabled={!isEditMode}
          />
          {/* {errors.github_link?.message && (
            <p className="ml-24 mt-2 text-sm text-red-400">{errors.github_link?.message}</p>
          )} */}
          <Input
            id="fb_link"
            {...register("fb_link")}
            label="Facebook"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
          {/* {errors.fb_link?.message && <p className="ml-24 mt-2 text-sm text-red-400">{errors.fb_link?.message}</p>} */}
          <Input
            id="linkedin_link"
            {...register("linkedin_link")}
            label="Linkedin"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
          {/* {errors.linkedin_link?.message && (
            <p className="ml-24 mt-2 text-sm text-red-400">{errors.linkedin_link?.message}</p>
          )} */}
          <Input
            id="telegram_link"
            {...register("telegram_link")}
            label="Telegram"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
          {/* {errors.telegram_link?.message && (
            <p className="ml-24 mt-2 text-sm text-red-400">{errors.telegram_link?.message}</p>
          )} */}
          <Input
            id="whatsapp_link"
            {...register("whatsapp_link")}
            label="Whatsapp"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
          {/* {errors.whatsapp_link?.message && (
            <p className="ml-24 mt-2 text-sm text-red-400">{errors.whatsapp_link?.message}</p>
          )} */}
          <Input
            id="skype_link"
            {...register("skype_link")}
            label="Skype"
            disabled={!isEditMode}
            parentClassName="flex w-full flex-col justify-between gap-2"
            variant={isEditMode ? "lightgray" : "darkgray"}
            className="rounded"
          />
          {/* {errors.skype_link?.message && (
            <p className="ml-24 mt-2 text-sm text-red-400">{errors.skype_link?.message}</p>
          )} */}
        </div>
        {isEditMode ? (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="hollow" onClick={handleSaveClick} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="default" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : null}
      </form>
    </Box>
  )
}

export default ContactInfo