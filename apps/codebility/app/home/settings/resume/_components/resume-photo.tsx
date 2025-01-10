"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Box from "@/Components/shared/dashboard/Box";
import { Paragraph } from "@/Components/shared/home";
import { defaultAvatar } from "@/public/assets/images";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";

import { Profile_Types } from "../_types/resume";
import { removeAvatar, updateProfile } from "../action";

type PhotoProps = {
  data: Profile_Types;
};
const Photo = ({ data }: PhotoProps) => {
  const supabase = getSupabaseBrowserClient();
  const [myAvatar, setAvatar] = useState<string | any>(
    defaultAvatar || data?.image_url,
  );
  useEffect(() => {
    if (data?.image_url) {
      setAvatar(data?.image_url);
    }
  }, [data?.image_url]);

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const toastId = toast.loading("Your avatar is being uploaded");
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
    const bucket = "profiles";
    const filePath = `avatars/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl;
    if (publicUrl) {
      setAvatar(publicUrl);
      await updateProfile({ image_url: publicUrl });
      toast.success("You sucessfully added an avatar!", { id: toastId });
    } else {
      console.error("Public URL is undefined");
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setAvatar(defaultAvatar);
      if (myAvatar !== defaultAvatar) {
        await updateProfile({ image_url: "" });
        toast.success("Your Avatar was sucessfully removed!");
        await removeAvatar(myAvatar);
      }
    } catch (error) {
      console.error("Error while removing avatar:", error);
    }
  };
  const {
    formState: {},
  } = useForm({
    defaultValues: {},
  });
  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <p className="text-lg">Your Photo</p>
      <Paragraph className="py-4">
        Upload your photo to make your profile stand out. We recommend an image
        of 200x200 pixels in JPG or PNG format.
      </Paragraph>
      <div className="flex gap-4">
        <div className="relative size-[80px]">
          <Image
            src={myAvatar}
            alt="Avatar"
            fill
            sizes="80px"
            className="from-violet h-auto w-auto rounded-lg bg-gradient-to-b to-blue-500 bg-cover object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex gap-4">
            {myAvatar === defaultAvatar ? (
              <div className="relative">
                <label htmlFor="image">
                  <p className="cursor-pointer transition duration-300 hover:text-blue-100">
                    Upload Image
                  </p>
                </label>
                <input
                  onChange={handleUploadAvatar}
                  id="image"
                  type="file"
                  className="hidden"
                />
                <input type="hidden" name="avatar" value={myAvatar} />
              </div>
            ) : (
              <Link href={`#`}>
                <p
                  className="cursor-pointer transition duration-300 hover:text-blue-100"
                  onClick={handleRemoveAvatar}
                >
                  Remove Image
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};
export default Photo;
