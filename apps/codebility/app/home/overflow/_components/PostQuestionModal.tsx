"use client";

import { useState, useEffect } from "react";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";
import { X, Upload, AlertCircle, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";
import { Alert, AlertDescription } from "@codevs/ui/alert";
import Image from "next/image";
import { Loader2 } from "lucide-react"; // spinner icon

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  authorId: string;
}

interface PostQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    id: string,
    title: string;
    content: string;
    tags: string[];
    images: string[];
    authorId: string;
  }) => void;
  editQuestion?: Question | null; // Optional question to edit
  mode?: 'create' | 'edit'; // Mode of the modal
}

export default function PostQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  editQuestion = null,
  mode = 'create',
}: PostQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);


  const isEditMode = mode === 'edit' && editQuestion;

  // Populate form when editing
  useEffect(() => {
    if (isEditMode) {
      setTitle(editQuestion.title);
      setContent(editQuestion.content);
      setTagsInput(editQuestion.tags.join(", "));
      setImages(editQuestion.images || []);
    } else {
      resetForm();
    }
  }, [isEditMode, editQuestion, isOpen]);

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Please enter a question title");
      return;
    }
    if (title.trim().length < 10) {
      setError("Question title must be at least 10 characters");
      return;
    }
    if (!content.trim()) {
      setError("Please provide question details");
      return;
    }
    if (content.trim().length < 20) {
      setError("Question details must be at least 20 characters");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    setSubmitting(true);

    try {
      if (isEditMode && editQuestion) {
        await onSubmit({
          id: editQuestion.id,
          authorId: editQuestion.authorId,
          title: title.trim(),
          content: content.trim(),
          tags,
          images,
        });
      } else {
        await onSubmit({
          id: "",
          authorId: "",
          title: title.trim(),
          content: content.trim(),
          tags,
          images,
        });
      }

      if (!isEditMode) {
        resetForm();
      }
      onClose();
    } catch (e) {
      // handle errors if onSubmit throws
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const resetForm = () => {
    setTitle("");
    setContent("");
    setTagsInput("");
    setImages([]);
    setError(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);

    try {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            reject(new Error(`${file.name} is too large. Max size is 5MB.`));
            return;
          }

          // Validate file type
          if (!file.type.startsWith('image/')) {
            reject(new Error(`${file.name} is not a valid image file.`));
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            } else {
              reject(new Error(`Failed to read ${file.name}`));
            }
          };
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });
      });

      const uploadedImages = await Promise.all(imagePromises);
      
      // Check total images count
      if (images.length + uploadedImages.length > 5) {
        setError("Maximum 5 images allowed per question");
        return;
      }

      setImages(prev => [...prev, ...uploadedImages]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      setError(errorMessage);
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit with Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] flex flex-col p-0 ${submitting ? "backdrop-blur-sm pointer-events-none" : ""}`}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Question' : 'Ask a Question'}
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="rounded-full h-8 w-8 p-0 opacity-70 hover:opacity-100 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 px-6">
          <div className="space-y-5 py-5" onKeyDown={handleKeyDown}>
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., How to handle async state in React?"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError(null);
                }}
                maxLength={150}
                className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-2 focus:ring-customBlue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {title.length}/150 characters • Be specific and clear
              </p>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question Details <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Describe your problem in detail. Include:&#10;• What you're trying to achieve&#10;• What you've tried so far&#10;• Any error messages&#10;• Code snippets (if relevant)"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError(null);
                }}
                rows={10}
                maxLength={5000}
                className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-2 focus:ring-customBlue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400 resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {content.length}/5000 characters • Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">Ctrl+Enter</kbd> to submit
              </p>
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="e.g., React, TypeScript, CSS"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-2 focus:ring-customBlue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Separate tags with commas • Helps others find your question
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Screenshots {images.length > 0 && <span className="text-gray-500">({images.length}/5)</span>}
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages || images.length >= 5}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                    uploadingImages || images.length >= 5
                      ? 'cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-800'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {uploadingImages ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-customBlue-500" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {images.length >= 5 ? 'Max images reached' : 'Upload Images'}
                    </>
                  )}
                </Label>
                <p className="text-xs text-gray-500">
                  JPG, PNG, GIF • Max 5MB each
                </p>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  {images.map((image, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                      <Image
                        src={image}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 h-7 w-7 rounded-full bg-red-500 p-0 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
         <div className="flex justify-between items-center gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: {isEditMode ? 'Update your question to make it clearer' : 'Clear questions get better answers faster'}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
              className="border-foreground text-white hover:text-white bg-red-500 border-gray-600 hover:bg-red-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={uploadingImages || submitting || !title.trim() || !content.trim()}
              className="bg-gradient-to-r from-customBlue-500 to-indigo-500 hover:from-customBlue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isEditMode ? 'Update Question' : 'Post Question'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}