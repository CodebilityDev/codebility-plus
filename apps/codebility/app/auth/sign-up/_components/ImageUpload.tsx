"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

import { cn } from "@codevs/ui";

interface ImageUploadProps {
  onChange: (file: File) => void;
  value?: File | null;
  error?: string;
}

export const ImageUpload = ({ onChange, value, error }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="relative self-start">
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />
      <div
        onClick={handleClick}
        className={cn(
          "relative h-24 w-24 cursor-pointer rounded-full",
          "border-full border-2",
          error ? "border-red-400" : "border-darkgray",
          "transition-all hover:opacity-80",
        )}
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile preview"
            fill
            sizes="96px"
            className="rounded-full object-cover"
          />
        ) : (
          <div className="bg-dark-200 flex h-full w-full items-center justify-center rounded-full">
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Overlay upload icon */}
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
          <Upload className="h-8 w-8 text-white" />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
};
