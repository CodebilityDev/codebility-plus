"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { Label } from "@codevs/ui/label";
import { uploadImage, deleteImage, getImagePath } from "@/utils/uploadImage";
import { toast } from "sonner";

interface BannerImageUploadProps {
  value?: string; // Current image URL
  onChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export default function BannerImageUpload({ 
  value, 
  onChange, 
  disabled = false 
}: BannerImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload to Supabase storage in 'banner' folder
      const publicUrl = await uploadImage(file, {
        bucket: "codebility",
        folder: "banner",
        cacheControl: "3600",
        upsert: true
      });

      // Clean up old image if exists
      if (value) {
        const oldImagePath = getImagePath(value);
        if (oldImagePath) {
          await deleteImage(oldImagePath, "codebility");
        }
      }

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      
      onChange(publicUrl);
      setPreview(publicUrl);
      toast.success("Banner image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setPreview(value || null);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [value, onChange]);

  const handleRemove = useCallback(async () => {
    if (!value) return;

    setIsUploading(true);
    try {
      // Delete from storage
      const imagePath = getImagePath(value);
      if (imagePath) {
        await deleteImage(imagePath, "codebility");
      }

      onChange(null);
      setPreview(null);
      toast.success("Banner image removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Banner Image (Optional)</Label>
      
      <div className="flex flex-col gap-3">
        {/* Image Preview */}
        {preview ? (
          <div className="relative group">
            <div className="relative w-full h-32 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
              <img
                src={preview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
              {/* Overlay with remove button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled || isUploading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Area */
          <div
            className={`
              w-full h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 
              bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-2
              hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={disabled ? undefined : triggerFileInput}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
              </div>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload banner image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={disabled || isUploading}
            className="flex items-center gap-2 border border-gray-300 bg-accent hover:bg-gray-300 dark:border-gray-700 dark:bg-gray-800 text-foreground dark:hover:bg-gray-700 rounded"
          >
            <Upload className="h-4 w-4" />
            {preview ? "Change Image" : "Upload Image"}
          </Button>
          
          {preview && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 rounded"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Banner images help make announcements more visually appealing and attention-grabbing.
      </p>
    </div>
  );
}