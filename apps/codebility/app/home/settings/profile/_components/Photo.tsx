"use client";

import type { StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Box from "@/components/shared/dashboard/Box";
import { Paragraph } from "@/components/shared/home";
import { useModal } from "@/hooks/use-modal";
import { defaultAvatar } from "@/public/assets/images";
import { deleteImage, getImagePath, uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

import { Button } from "@codevs/ui/button";

import { updateCodev } from "../action";
import UploadPhotoModal from "./UploadPhotoModal";

type PhotoProps = {
  data: {
    image_url: string | null;
  };
};

const Photo = ({ data }: PhotoProps) => {
  const [avatar, setAvatar] = useState<string | StaticImageData>(defaultAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const { onOpen } = useModal();

  const [croppedAvatar, setCroppedAvatar] = useState<string | null>(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  useEffect(() => {
    if (data?.image_url) {
      setAvatar(data.image_url);
    }
  }, [data?.image_url]);

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setCroppedAvatar(URL.createObjectURL(file));
      setOpenUploadModal(true);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleRemoveAvatar = async () => {
    if (avatar === defaultAvatar) return;

    const toastId = toast.loading("Removing your avatar...");
    try {
      const filePath = await getImagePath(avatar as string);
      if (filePath) {
        await deleteImage(filePath);
      }

      await updateCodev({ image_url: null });

      setAvatar(defaultAvatar);
      toast.success("Avatar removed successfully!", { id: toastId });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error("Failed to remove avatar", { id: toastId });
    }
  };

  const handleDeleteWarning = () => {
    onOpen("deleteWarningModal", {}, {}, handleRemoveAvatar);
  };

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
            src={avatar}
            alt="Avatar"
            fill
            sizes="80px"
            className="from-violet h-auto w-auto rounded-lg bg-gradient-to-b to-blue-500 bg-cover object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-col justify-start gap-2">
            {avatar === defaultAvatar ? (
              <label htmlFor="image" className="cursor-pointer">
                <p className="transition duration-300 hover:text-blue-100">
                  {isUploading ? "Uploading..." : "Upload Image"}
                </p>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            ) : (
              <Button
                variant="link"
                onClick={handleDeleteWarning}
                disabled={isUploading}
                className="cursor-pointer transition duration-300 hover:text-blue-100 hover:no-underline dark:text-white"
              >
                Remove Image
              </Button>
            )}
          </div>
        </div>

        <UploadPhotoModal
          open={openUploadModal}
          setOpen={setOpenUploadModal}
          image={croppedAvatar || ""}
          setImage={setCroppedAvatar}
          setAvatar={setAvatar}
        />
      </div>
    </Box>
  );
};

export default Photo;
