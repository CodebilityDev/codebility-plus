"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface ThumbnailUploadProps {
  onChange?: (file: File | null) => void;
  defaultImage?: string | null; // optional existing image URL
}

export default function ThumbnailUpload({
  onChange,
  defaultImage,
}: ThumbnailUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load default image when component mounts or defaultImage changes
  useEffect(() => {
    if (defaultImage) {
      setPreview(defaultImage);
      setFile(null); // no new file yet, just showing existing image
    }
  }, [defaultImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
      onChange?.(newFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange?.(null);
  };

  return (
    <div
      className="relative flex h-32 w-52 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-gray-700 bg-[#1e1e1e]"
      onClick={() => {
        if (!file) inputRef.current?.click();
      }}
    >
      {!preview ? (
        <span className="text-gray-400">Thumbnail</span>
      ) : (
        <>
          <img
            src={preview}
            alt="Thumbnail preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-sm bg-gray-800 text-white hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <X size={14} />
          </button>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
