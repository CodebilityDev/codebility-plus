"use client";

import { memo, useState } from "react";

import { Button } from "@/components/global/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/global/ui/dialog";
import { Slider } from "@/components/applicant/profile/sliders";
import getCroppedImg from "@/hooks/applicant/profile/useImageCrop";
import { uploadImage } from "@/actions/applicant/profile/upload-image";
import { DialogTitle } from "@radix-ui/react-dialog";
import type { Area, Point } from "react-easy-crop";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";

import { cn } from "@codevs/ui";
import type { UploadPhotoModalProps } from "@/types/applicant/profile/profile";

export default function UploadPhotoModal({
  open,
  setOpen,
  image,
  setImage,
  setAvatar,
}: UploadPhotoModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setImage(null);
  };

  /* 
    upload photo in server
  */
  const handleSave = async () => {
    const toastId = toast.loading("Uploading your avatar...");
    setIsUploading(true);

    try {
      const { url, file } = await getCroppedImg(image, croppedAreaPixels, 0);

      if (!url) {
        throw new Error("Failed to crop image");
      }

      const publicUrl = await uploadImage(file, {
        bucket: "codebility",
        folder: "profileImage",
      });

      setAvatar(publicUrl);

      toast.success("Avatar uploaded successfully!", { id: toastId });

      setOpen(false);
    } catch (error) {
      console.error(error);
      setError("Failed to crop image");
      toast.error((error as Error).message);
    } finally {
      setIsUploading(false);
      handleReset();
    }
  };

  const handleCancel = () => {
    handleReset();
    setError(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
        </DialogHeader>

        <div className="relative h-96 w-full">
          {/* cropper */}
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            restrictPosition={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Zoom</label>
          <Slider
            defaultValue={[zoom]}
            max={3}
            step={0.1}
            min={0.4}
            onValueChange={(value) => {
              if (value[0] !== undefined) {
                setZoom(value[0]);
              }
            }}
          />
        </div>

        {/* error */}
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

        <DialogFooter>
          <Button
            onClick={handleCancel}
            disabled={isUploading}
            className={cn(isUploading && "cursor-not-allowed opacity-80")}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isUploading}
            className={cn(isUploading && "cursor-not-allowed opacity-80")}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

memo(UploadPhotoModal);
