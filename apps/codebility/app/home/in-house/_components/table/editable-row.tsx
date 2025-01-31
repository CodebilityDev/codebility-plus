import { useEffect, useState } from "react";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import { Codev, InternalStatus, Position } from "@/types/home/codev";
import { uploadImage } from "@/utils/uploadImage";
import { Check, Plus, Upload, X } from "lucide-react";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { TableCell, TableRow } from "@codevs/ui/table";

import { useCodevForm } from "../../_hooks/use-codev-form";
import { ProjectSelect } from "../shared/project-select";
import { columns } from "./columns";

interface EditableRowProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
}

export function EditableRow({ data, onSave, onCancel }: EditableRowProps) {
  const { data: formData, handleChange, isSubmitting } = useCodevForm(data);
  const supabase = useSupabase();
  const [positions, setPositions] = useState<Position[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    formData.image_url || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchPositions() {
      const { data: positionsData, error } = await supabase
        .from("positions")
        .select("id, name");

      if (error) {
        console.error("Failed to fetch positions:", error);
      } else if (positionsData) {
        setPositions(positionsData);
      }
    }

    fetchPositions();
  }, [supabase]);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image using our utility
      const { publicUrl } = await uploadImage(file, {
        bucket: "codebility",
        folder: "profileImage",
      });

      // Update form data with the new URL
      setUploadedImage(publicUrl);
      handleChange("image_url", publicUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderCell = (key: keyof Codev) => {
    if (key === "image_url") {
      return (
        <div className="relative inline-block">
          {uploadedImage ? (
            <div className="relative">
              <img
                src={uploadedImage}
                alt="Profile"
                className="border-light-700 dark:border-dark-200 h-10 w-10 rounded-full object-cover"
              />
              <label
                htmlFor="upload-avatar"
                className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-gray-200 p-0.5 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Plus className="h-6 w-6 text-gray-500 text-green-500 dark:text-gray-300" />
                <input
                  id="upload-avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          ) : (
            <label
              htmlFor="upload-avatar"
              className="cursor-pointer rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Upload className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              <input
                id="upload-avatar"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          )}
        </div>
      );
    }

    switch (key) {
      case "internal_status":
        return (
          <Select
            value={formData.internal_status || undefined}
            onValueChange={(value: InternalStatus) =>
              handleChange("internal_status", value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="border-light-700 bg-light-800 dark:border-dark-200 dark:bg-dark-200">
              <SelectValue placeholder="Select internal status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              {Object.entries(INTERNAL_STATUS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "display_position":
        return (
          <Select
            value={formData.display_position || ""} // Ensure value is a string
            onValueChange={(value) => handleChange("display_position", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="border-light-700 bg-light-800 dark:border-dark-200 dark:bg-dark-200">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              {positions.map((position) => (
                <SelectItem key={position.id} value={position.name || ""}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "projects":
        return (
          <ProjectSelect
            value={formData.projects || []}
            onChange={(projects) => handleChange("projects", projects)}
            disabled={isSubmitting}
          />
        );

      case "nda_status":
        return (
          <Select
            value={formData.nda_status ? "Received" : "Not Received"}
            onValueChange={(value) =>
              handleChange("nda_status", value === "Received")
            }
          >
            <SelectTrigger className="border-light-700 bg-light-800 dark:border-dark-200 dark:bg-dark-200">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="Received">Received</SelectItem>
              <SelectItem value="Not Received">Not Received</SelectItem>
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            value={String(formData[key] || "")}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={isSubmitting}
            className="border-light-700 bg-light-800 dark:border-dark-200 dark:bg-dark-200 text-black dark:text-white"
          />
        );
    }
  };

  return (
    <TableRow className="bg-light-800 dark:bg-dark-200">
      {columns.map((column) => (
        <TableCell key={column.key} className="p-2">
          {renderCell(column.key as keyof Codev)}
        </TableCell>
      ))}
      <TableCell className="p-2">
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onSave(formData)}
            disabled={isSubmitting || isUploading}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <Check className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
            className="hover:bg-red-500/20 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
