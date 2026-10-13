"use client";

import type { FormEvent } from "react";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createProject } from "@/actions/home/projects/projects";
import { uploadProjectImage } from "@/actions/home/projects/upload-image";
import {
  COVER_IMAGE_MIN_WIDTH,
  COVER_IMAGE_MIN_HEIGHT,
  COVER_IMAGE_MAX_FILE_SIZE,
  COVER_IMAGE_ALLOWED_TYPES,
} from "@/constants/home/projects/projects";
import { Button } from "@/components/global/ui/button";
import { useModal } from "@/hooks/global/use-modal";
import type { ProjectFormInput } from "@/types/home/projects/projects";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@codevs/ui/sheet";
import { Textarea } from "@codevs/ui/textarea";

function readField(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

function readOptional(data: FormData, field: string) {
  const value = readField(data, field).trim();
  return value.length > 0 ? value : undefined;
}

function readList(data: FormData, field: string) {
  const value = readField(data, field).trim();
  if (value.length === 0) return undefined;
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return items.length > 0 ? items : undefined;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
}

export default function ProjectCreateDrawer() {
  const router = useRouter();
  const { isOpen, onClose } = useModal();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function handleCoverImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setCoverImageError(null);

    if (!file) {
      setCoverImage(null);
      setCoverImagePreview(null);
      return;
    }

    if (!COVER_IMAGE_ALLOWED_TYPES.includes(file.type as (typeof COVER_IMAGE_ALLOWED_TYPES)[number])) {
      setCoverImageError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    if (file.size > COVER_IMAGE_MAX_FILE_SIZE) {
      setCoverImageError("File size exceeds 5MB limit.");
      return;
    }

    const dimensions = await getImageDimensions(file);
    if (dimensions.width < COVER_IMAGE_MIN_WIDTH || dimensions.height < COVER_IMAGE_MIN_HEIGHT) {
      setCoverImageError(
        `Image must be at least ${COVER_IMAGE_MIN_WIDTH}x${COVER_IMAGE_MIN_HEIGHT} pixels. Current: ${dimensions.width}x${dimensions.height}.`,
      );
      return;
    }

    setCoverImage(file);
    setCoverImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    let mainImage: string | undefined;

    if (coverImage) {
      setUploadingImage(true);
      try {
        mainImage = await uploadProjectImage(coverImage);
      } catch (caught) {
        setUploadingImage(false);
        setError(
          caught instanceof Error ? caught.message : "Could not upload cover image.",
        );
        return;
      }
      setUploadingImage(false);
    }

    const input: ProjectFormInput = {
      name: readField(data, "name").trim(),
      tagline: readOptional(data, "tagline"),
      status: readOptional(data, "status"),
      description: readOptional(data, "description"),
      projectCode: readOptional(data, "projectCode"),
      startDate: readOptional(data, "startDate"),
      endDate: readOptional(data, "endDate"),
      githubLink: readOptional(data, "githubLink"),
      websiteUrl: readOptional(data, "websiteUrl"),
      figmaLink: readOptional(data, "figmaLink"),
      meetingLink: readOptional(data, "meetingLink"),
      techStack: readList(data, "techStack"),
      keyFeatures: readList(data, "keyFeatures"),
      mainImage,
    };

    setPending(true);
    setError(null);

    try {
      await createProject(input);
      form.reset();
      setCoverImage(null);
      setCoverImagePreview(null);
      onClose();
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not create the project.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <SheetContent side="right" className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New project</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Name</Label>
            <Input id="project-name" name="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-tagline">Tagline</Label>
            <Input id="project-tagline" name="tagline" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-status">Status</Label>
            <Input id="project-status" name="status" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea id="project-description" name="description" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-code">Project code</Label>
            <Input id="project-code" name="projectCode" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-start-date">Start date</Label>
            <Input id="project-start-date" name="startDate" type="date" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-end-date">End date</Label>
            <Input id="project-end-date" name="endDate" type="date" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-github-link">GitHub link</Label>
            <Input id="project-github-link" name="githubLink" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-website-url">Website URL</Label>
            <Input id="project-website-url" name="websiteUrl" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-figma-link">Figma link</Label>
            <Input id="project-figma-link" name="figmaLink" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-meeting-link">Meeting link</Label>
            <Input id="project-meeting-link" name="meetingLink" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-tech-stack">Tech stack</Label>
            <Input
              id="project-tech-stack"
              name="techStack"
              placeholder="React, TypeScript, Next.js"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-key-features">Key features</Label>
            <Input
              id="project-key-features"
              name="keyFeatures"
              placeholder="Auth, Dashboard, API"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-cover-image">Cover image</Label>
            <Input
              id="project-cover-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverImageChange}
              disabled={uploadingImage}
            />
            <p className="text-xs text-muted-foreground">
              Minimum {COVER_IMAGE_MIN_WIDTH}x{COVER_IMAGE_MIN_HEIGHT}px. Max 5MB. JPEG, PNG, WebP.
            </p>
            {coverImagePreview && (
              <div className="relative w-full max-w-xs aspect-video">
                <Image
                  src={coverImagePreview}
                  alt="Cover preview"
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </div>
            )}
            {coverImageError && (
              <p role="alert" className="text-sm text-destructive">
                {coverImageError}
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            loading={pending || uploadingImage}
            loadingText={uploadingImage ? "Uploading image..." : "Creating project..."}
          >
            Create project
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
