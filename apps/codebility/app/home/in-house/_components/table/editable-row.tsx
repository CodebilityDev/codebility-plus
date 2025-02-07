"use client";

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

// Supabase returns this shape for roles (id, name).
// It must match what you SELECT from the "roles" table.
export interface Role {
  id: number;
  name: string;
}

interface EditableRowProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
  /**
   * Pass roles down from the parent to avoid fetching in two places.
   */
  roles: Role[];
}

export function EditableRow({
  data,
  onSave,
  onCancel,
  roles,
}: EditableRowProps) {
  const { data: formData, handleChange, isSubmitting } = useCodevForm(data);
  const supabase = useSupabase();

  const [positions, setPositions] = useState<Position[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    formData.image_url || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  // Fetch "positions" only (roles come from the parent).
  useEffect(() => {
    async function fetchData() {
      // Fetch positions (id, name) from the "positions" table
      const { data: positionsData, error: positionsError } = await supabase
        .from("positions")
        .select("id, name");

      if (positionsError) {
        console.error("Failed to fetch positions:", positionsError);
      } else if (positionsData) {
        setPositions(positionsData);
      }
    }

    fetchData();
  }, [supabase]);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to your Supabase bucket
      const { publicUrl } = await uploadImage(file, {
        bucket: "codebility",
        folder: "profileImage",
      });

      setUploadedImage(publicUrl);
      handleChange("image_url", publicUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Renders different input types based on the Codev key
   */
  const renderCell = (key: keyof Codev) => {
    switch (key) {
      case "image_url":
        return (
          <div className="relative inline-block">
            {uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Profile"
                  className="border-light-700 dark:border-dark-200 h-10 w-10 rounded-full border object-cover"
                />
                <label
                  htmlFor="upload-avatar"
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-gray-200 p-0.5 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4 text-gray-500 dark:text-gray-300" />
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
              <SelectValue placeholder="Select status" />
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

      case "role_id":
        return (
          <Select
            value={String(formData.role_id || "")}
            onValueChange={(value) => handleChange("role_id", parseInt(value))}
            disabled={isSubmitting}
          >
            <SelectTrigger className="border-light-700 bg-light-800 dark:border-dark-200 dark:bg-dark-200">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "display_position":
        return (
          <Select
            value={formData.display_position || ""}
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
            value={formData.nda_status ? "Yes" : "No"}
            onValueChange={(value) =>
              handleChange("nda_status", value === "Yes")
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="border-light-700 bg-light-800 dark:border-dark-200 dark:bg-dark-200">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
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
      <TableCell className="p-2">{renderCell("image_url")}</TableCell>
      <TableCell className="p-2">{renderCell("first_name")}</TableCell>
      <TableCell className="p-2">{renderCell("last_name")}</TableCell>
      <TableCell className="p-2">{renderCell("email_address")}</TableCell>
      <TableCell className="p-2">{renderCell("internal_status")}</TableCell>
      <TableCell className="p-2">{renderCell("role_id")}</TableCell>
      <TableCell className="p-2">{renderCell("display_position")}</TableCell>
      <TableCell className="p-2">{renderCell("projects")}</TableCell>
      <TableCell className="p-2">{renderCell("nda_status")}</TableCell>
      <TableCell className="p-2">{renderCell("portfolio_website")}</TableCell>
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
