import React, { memo, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Slider } from "../components/ui/sliders";
import getCroppedImg from "@/hooks/useImageCrop";
import Cropper, { Area, Point } from "react-easy-crop";

export default function ImageCrop({
  image,
  setImage,
  setFile,
  open,
  setOpen,
}: {
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set aspect ratio to 16/9 to match aspect-video used in the card display
  const aspectRatio = 16 / 9;

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      const { url, file } = await getCroppedImg(image, croppedAreaPixels, 0);

      if (!url || !file) {
        throw new Error("Failed to crop image");
      }
      setImage(url);
      setFile(file);
      setOpen(false);
    } catch (error) {
      console.error(error);
      setError("Failed to crop image");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative h-96 w-full">
          {/* cropper */}
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
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
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const MemoizedImageCrop = memo(ImageCrop);
