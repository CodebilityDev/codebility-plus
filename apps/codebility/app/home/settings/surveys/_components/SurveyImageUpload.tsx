"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { Label } from "@codevs/ui/label";
import { uploadImage, deleteImage, getImagePath } from "@/utils/uploadImage";
import { toast } from "sonner";

interface SurveyImageUploadProps {
  value?: string;
  onChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export default function SurveyImageUpload({
  value,
  onChange,
  disabled = false,
}: SurveyImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);

      try {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        const publicUrl = await uploadImage(file, {
          bucket: "codebility",
          folder: "survey",
          cacheControl: "3600",
          upsert: true,
        });

        if (value) {
          const oldImagePath = await getImagePath(value);
          if (oldImagePath) await deleteImage(oldImagePath, "codebility");
        }

        URL.revokeObjectURL(previewUrl);
        onChange(publicUrl);
        setPreview(publicUrl);
        toast.success("Survey image uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
        setPreview(value || null);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [value, onChange],
  );

  const handleRemove = useCallback(async () => {
    if (!value) return;
    setIsUploading(true);
    try {
      const imagePath = await getImagePath(value);
      if (imagePath) await deleteImage(imagePath, "codebility");
      onChange(null);
      setPreview(null);
      toast.success("Survey image removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground dark:text-gray-300">
          Survey Image <span className="text-gray-500">(Optional)</span>
        </Label>
        {/* Recommended spec label — tells user exactly what to upload */}
        <span className="text-xs text-gray-500 dark:text-gray-500">
          Recommended: <span className="font-medium text-gray-400">200×200px square</span>
          {" · "}PNG or JPG
          {" · "}max 5MB
        </span>
      </div>

      <div className="flex gap-4 items-start">
        {/* Left: square preview matching the thumbnail size/shape */}
        <div className="flex-shrink-0">
          <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-dashed border-gray-600 bg-gray-800 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Survey thumbnail preview"
                // object-cover fills the square — same behavior as the card thumbnail
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-600" />
            )}
          </div>
          {/* Hint below the square preview */}
          <p className="mt-1 text-center text-[10px] text-gray-600">Preview</p>
        </div>

        {/* Right: upload area + guidance */}
        <div className="flex-1 space-y-3">
          {/* Drag/click upload zone */}
          <div
            className={`w-full rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 px-4 py-5
              flex flex-col items-center justify-center gap-1 transition-colors
              hover:border-gray-500 hover:bg-gray-800 cursor-pointer
              ${disabled ? "cursor-not-allowed opacity-50" : ""}
            `}
            onClick={disabled ? undefined : () => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-violet-500" />
                <span className="text-sm text-gray-400">Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-400">
                  {preview ? "Click to change image" : "Click to upload image"}
                </p>
                {/* Format + dimension guidance inline */}
                <p className="text-xs text-gray-600">
                  Square image works best · PNG, JPG · Max 5MB
                </p>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex items-center gap-2 rounded-lg border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Upload className="h-4 w-4" />
              {preview ? "Change" : "Upload"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}