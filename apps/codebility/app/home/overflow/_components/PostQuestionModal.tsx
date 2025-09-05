"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";

interface PostQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; tags: string[]; images: string[] }) => void;
}

export default function PostQuestionModal({
  isOpen,
  onClose,
  onSubmit,
}: PostQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags,
        images,
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setTagsInput("");
      setImages([]);
    } catch (error) {
      console.error("Error posting question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle("");
      setContent("");
      setTagsInput("");
      setImages([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Ask a Question
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 dark:text-white">Question Title</Label>
            <Input
              id="title"
              placeholder="e.g., How to handle async state in React?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
              className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-700 dark:text-white">Question Details</Label>
            <Textarea
              id="content"
              placeholder="Describe your problem in detail. Include any error messages, code snippets, or steps you've already tried..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={8}
              required
              className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-700 dark:text-white">Tags (optional)</Label>
            <Input
              id="tags"
              placeholder="e.g., React, TypeScript, CSS (comma-separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={isSubmitting}
              className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Add relevant tags to help others find your question
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-white">Screenshots (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Upload className="h-4 w-4" />
                Upload Images
              </Label>
              <p className="text-xs text-gray-500">
                Add screenshots to help explain your issue
              </p>
            </div>
            
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Screenshot ${index + 1}`}
                      width={200}
                      height={150}
                      className="rounded-md border object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 h-6 w-6 rounded-full bg-red-500 p-0 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}