import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import { User } from "@/types"

import { updateProfile } from "@/app/api/resume"
import useToken from "@/hooks/use-token"
import Box from "@/Components/shared/dashboard/Box"
import { Paragraph } from "@/Components/shared/home"
import { defaultAvatar } from "@/public/assets/images"

import axios from "axios"
import { API } from "@/lib/constants"

const Photo = ({ user }: { user: User }) => {
  const { id, image_url } = user
  const { token } = useToken()

  const [myAvatar, setAvatar] = useState<string | any>(image_url || defaultAvatar)

  const handleUploadAvatar = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0]

    if (file) {
      const formData = new FormData()
      formData.append("image", file)
      const response = await axios.post(`${API.USERS}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const image_url = await response.data.data.image_url
      setAvatar(image_url)
      await updateProfile(id as string, { image_url }, token)
    }
  }

  const handleRemoveAvatar = async () => {
    setAvatar(defaultAvatar)
    await updateProfile(id as string, { image_url: null }, token)
  }

  const {
    formState: {},
  } = useForm({
    defaultValues: {},
  })

  return (
    <Box className="relative flex flex-col gap-2 bg-light-900 dark:bg-dark-100">
      <p className="text-lg">Your Photo</p>
      <Paragraph className="py-4">
        Upload your photo to make your profile stand out. We recommend an image of 200x200 pixels in JPG or PNG format.
      </Paragraph>
      <div className="flex gap-4">
        <div className="relative size-[80px]">
          <Image
            src={myAvatar}
            alt="Avatar"
            fill
            className="h-auto w-auto rounded-lg bg-gradient-to-b from-violet to-blue-500 bg-cover object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex gap-4">
            {myAvatar === defaultAvatar ? (
              <div className="relative">
                <label htmlFor="image">
                  <p className="cursor-pointer transition duration-300 hover:text-blue-100">Upload Image</p>
                </label>
                <input onChange={handleUploadAvatar} id="image" type="file" className="hidden" />
                <input type="hidden" name="avatar" value={myAvatar} />
              </div>
            ) : (
              <Link href={`#`}>
                <p className="cursor-pointer transition duration-300 hover:text-blue-100" onClick={handleRemoveAvatar}>
                  Remove Image
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Box>
  )
}

export default Photo
