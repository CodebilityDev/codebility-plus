"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Upload, Save } from "lucide-react";
import { AnnouncementPage } from "./types";
import { createClientClientComponent } from "@/utils/supabase/client";
import AnnouncementRichTextEditor from "./AnnouncementRichTextEditor";

interface AnnouncementEditorProps {
  page: AnnouncementPage;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPage: AnnouncementPage) => Promise<void>;
}

export const AnnouncementEditor: React.FC<AnnouncementEditorProps> = ({
  page,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [bannerImage, setBannerImage] = useState(page.banner_image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClientClientComponent();

  // Reset state when page changes
  useEffect(() => {
    setTitle(page.title);
    setContent(page.content);
    setBannerImage(page.banner_image);
    setImageFile(null);
    setImagePreview(null);
  }, [page]);

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    if (!supabase) throw new Error('Supabase client not initialized');

    try {
      setIsUploading(true);

      // Create a unique filename
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${page.category}-${Date.now()}.${fileExt}`;
      const filePath = `announcementBanner/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("codebility")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Return the public URL
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/codebility/${filePath}`;
      
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);

      let finalBannerImage = bannerImage;

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          finalBannerImage = uploadedUrl;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Create updated page object
      const updatedPage: AnnouncementPage = {
        ...page,
        title,
        content,
        banner_image: finalBannerImage,
        last_updated: new Date().toISOString(),
      };

      // Call the onSave prop
      await onSave(updatedPage);

      // Close the editor
      onClose();
    } catch (error) {
      console.error("Error saving announcement:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setTitle(page.title);
    setContent(page.content);
    setBannerImage(page.banner_image);
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Editor Modal */}
      <div
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-modal-title"
      >
        <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900 pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
            <h2
              id="editor-modal-title"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              Edit Announcement
            </h2>
            <button
              onClick={handleCancel}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label="Close editor"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="announcement-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Title
              </label>
              <input
                id="announcement-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter announcement title"
              />
            </div>

            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banner Image
              </label>
              
              {/* Current/Preview Image */}
              <div className="mb-3">
                <img
                  src={imagePreview || bannerImage}
                  alt="Banner preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* Upload Button */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Change Image"}
                </button>
                {imageFile && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {imageFile.name}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Recommended: 1200x400px, Max size: 5MB
              </p>
            </div>

            {/* Rich Text Content Editor with Tiptap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content
              </label>
              <AnnouncementRichTextEditor
                value={content}
                onChange={setContent}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-800">
            <button
              onClick={handleCancel}
              disabled={isSaving || isUploading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading || !title.trim() || !content.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};