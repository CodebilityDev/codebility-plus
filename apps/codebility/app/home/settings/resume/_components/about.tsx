"use client"
import {  useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import Box from "@/Components/shared/dashboard/Box"
import { Textarea } from "@codevs/ui/textarea"
import { Label } from "@codevs/ui/label"
import {   updateProfile } from "../action"
import { Profile_Types } from "../_types/resume"

type About_Props = {
data: Profile_Types
}

const About = ({data}: About_Props) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: {},
  } = useForm(
    {
    defaultValues: {
        about: "",
  },})
  useEffect(() => {
    if(data) {
      reset({
        about: data.about,
      })
    }
  }, [data, reset])

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Your info was being updated")
    try {
      setIsLoading(true)
      const {about} = data
      await updateProfile({about})
      toast.success("Your about was sucessfully updated!", {id: toastId})
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
    <Box className="relative flex flex-col gap-2 bg-light-900 dark:bg-dark-100">
      <IconEdit
        className={` ${
          isEditMode ? "hidden" : "w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        } `}
        onClick={handleEditClick}
      />

      <p className="text-lg">About</p>

      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col justify-between gap-1 p-2 dark:border-zinc-700">
            <Label>Tell more about yourself</Label>

            <div>
              <Textarea
                variant="resume"
                placeholder="Write something about yourself..."
                id="about_me"
                {...register("about")}
                disabled={!isEditMode}
                className={` placeholder-${
                  !isEditMode ? "lightgray dark:placeholder-gray" : "black-100 dark:placeholder-gray-400"
                }  ${
                  isEditMode
                    ? " border border-lightgray bg-white text-black-100 dark:border-zinc-700 dark:bg-dark-200 dark:text-white"
                    : "border-none bg-white text-dark-200  dark:bg-dark-200 dark:text-gray"
                }`}
              />
            </div>
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
      </div>
    </Box>
  )
}

export default About