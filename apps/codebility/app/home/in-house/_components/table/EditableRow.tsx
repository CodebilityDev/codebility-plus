"use client";

import { useEffect, useState } from "react";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import {
  Codev,
  Education,
  InternalStatus,
  Position,
  Project,
  WorkExperience,
} from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { uploadImage } from "@/utils/uploadImage";
import { Check, Plus, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";

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

import { ProjectSelect } from "../shared/ProjectSelect";

export interface Role {
  id: number;
  name: string;
}

interface EditableRowProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
  roles: Role[];
}

/**
 * COMPACT EditableRow - Minimized to Match Table Layout
 *
 * CHANGES:
 * - Reduced all padding to px-2 py-2 to match compact table design
 * - Smaller input fields and selects
 * - No horizontal scroll
 */
export function EditableRow({
  data,
  onSave,
  onCancel,
  roles,
}: EditableRowProps) {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const [editForm, setEditForm] = useState<Codev>(data);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    data.image_url || null,
  );
  const [positions, setPositions] = useState<Position[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

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

  const handleLocalChange = (key: keyof Codev, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      const publicUrl = await uploadImage(file, {
        bucket: "codebility",
        folder: "profileImage",
      });

      handleLocalChange("image_url", publicUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      const { id, projects, ...rest } = editForm;

      if (projects) {
        const { error: deleteError } = await supabase
          .from("project_members")
          .delete()
          .eq("codev_id", id);
        if (deleteError) throw deleteError;

        for (const project of projects ?? []) {
          const { error: insertError } = await supabase
            .from("project_members")
            .insert({
              codev_id: id,
              project_id: project.id,
              role: project.role || "Developer",
            });
          if (insertError) throw insertError;
        }
      }

      const allowedFields: (keyof Codev)[] = [
        "first_name",
        "last_name",
        "email_address",
        "image_url",
        "internal_status",
        "role_id",
        "display_position",
        "nda_status",
        "portfolio_website",
        "availability_status",
        "application_status",
        "level",
        "tech_stacks",
        "phone_number",
        "date_joined",
      ];

      const updateFields: Record<string, unknown> = {};
      const restTyped = rest as Partial<Codev>;

      for (const key of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(restTyped, key)) {
          updateFields[key] = restTyped[key];
        }
      }

      if (Object.keys(updateFields).length > 0) {
        const { error } = await supabase
          .from("codev")
          .update(updateFields)
          .eq("id", id);
        if (error) throw error;
      }

      toast.success("Member updated successfully");
      onSave(editForm);
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  className="border-light-700 dark:border-dark-200 h-8 w-8 rounded-full border object-cover"
                />
                <label
                  htmlFor="upload-avatar"
                  className="absolute -bottom-0.5 -right-0.5 cursor-pointer rounded-full bg-gray-200 p-0.5 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Plus className="h-2.5 w-2.5 text-gray-700 dark:text-gray-300" />
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
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 p-1 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Upload className="h-4 w-4 text-gray-700 dark:text-gray-300" />
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
            value={editForm.internal_status || undefined}
            onValueChange={(value: InternalStatus) =>
              handleLocalChange("internal_status", value)
            }
            disabled={isSubmitting || isUploading}
          >
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 h-8 border text-xs text-black dark:text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-xs text-black dark:text-white">
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
            value={String(editForm.role_id || "")}
            onValueChange={(value) =>
              handleLocalChange("role_id", parseInt(value))
            }
            disabled={isSubmitting || isUploading}
          >
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 h-8 border text-xs text-black dark:text-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-xs text-black dark:text-white">
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
            value={editForm.display_position || ""}
            onValueChange={(value) =>
              handleLocalChange("display_position", value)
            }
            disabled={isSubmitting || isUploading}
          >
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 h-8 border text-xs text-black dark:text-white">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-xs text-black dark:text-white">
              {positions.map((pos) => (
                <SelectItem key={pos.id} value={pos.name || ""}>
                  {pos.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "projects":
        return (
          <div className="flex items-center gap-1">
            <ProjectSelect
              value={editForm.projects || []}
              onChange={(projects) => handleLocalChange("projects", projects)}
              disabled={isSubmitting || isUploading}
              compact={true}
            />
          </div>
        );

      case "nda_status":
        return (
          <Select
            value={editForm.nda_status ? "Yes" : "No"}
            onValueChange={(value) =>
              handleLocalChange("nda_status", value === "Yes")
            }
            disabled={isSubmitting || isUploading}
          >
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 h-8 border text-xs text-black dark:text-white">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-xs text-black dark:text-white">
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        );

      case "availability_status":
        return (
          <SwitchStatusButton
            isActive={editForm.availability_status ?? false}
            handleSwitch={() =>
              handleLocalChange(
                "availability_status",
                !editForm.availability_status,
              )
            }
            disabled={isSubmitting || isUploading}
          />
        );

      case "date_joined":
        return (
          <Input
            type="date"
            value={
              editForm.date_joined
                ? new Date(editForm.date_joined).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const dateValue = e.target.value
                ? new Date(e.target.value).toISOString()
                : null;
              handleLocalChange("date_joined", dateValue);
            }}
            disabled={isSubmitting || isUploading}
            className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 h-8 border text-xs text-black dark:text-white"
          />
        );

      default:
        return (
          <Input
            value={String(editForm[key] || "")}
            onChange={(e) => handleLocalChange(key, e.target.value)}
            disabled={isSubmitting || isUploading}
            className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 h-8 w-full border text-xs text-black dark:text-white"
          />
        );
    }
  };

  return (
    <TableRow className="bg-light-200 dark:bg-dark-200 hover:bg-light-300 dark:hover:bg-dark-300">
      {/* COMPACT: All columns px-2 py-2, constrained widths to match table */}
      <TableCell className="w-12 px-2 py-2">{renderCell("image_url")}</TableCell>
      <TableCell className="w-24 px-2 py-2">{renderCell("first_name")}</TableCell>
      <TableCell className="w-24 px-2 py-2">{renderCell("last_name")}</TableCell>
      <TableCell className="w-40 px-2 py-2">{renderCell("email_address")}</TableCell>
      <TableCell className="hidden w-24 px-2 py-2 2xl:table-cell">{renderCell("internal_status")}</TableCell>
      <TableCell className="hidden w-20 px-2 py-2 2xl:table-cell">{renderCell("role_id")}</TableCell>
      <TableCell className="hidden w-32 px-2 py-2 2xl:table-cell">{renderCell("display_position")}</TableCell>
      <TableCell className="hidden w-32 px-2 py-2 2xl:table-cell">{renderCell("projects")}</TableCell>
      <TableCell className="hidden w-36 px-2 py-2 2xl:table-cell">{renderCell("nda_status")}</TableCell>
      <TableCell className="hidden w-16 px-2 py-2 2xl:table-cell">{renderCell("portfolio_website")}</TableCell>
      <TableCell className="hidden w-24 px-2 py-2 2xl:table-cell">{renderCell("date_joined")}</TableCell>
      <TableCell className="hidden w-20 px-2 py-2 2xl:table-cell">{renderCell("availability_status")}</TableCell>

      {/* COMPACT: Actions - smaller buttons */}
      <TableCell className="w-16 px-2 py-2">
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting || isUploading}
            className="hover:bg-green-500 dark:hover:bg-green-500 h-7 w-7 bg-white p-0 text-white dark:bg-transparent"
          >
            <Check className="text-black-100 h-3.5 w-3.5 dark:text-white" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
            className="hover:bg-red-500/20 hover:text-red-500 h-7 w-7 p-0"
          >
            <X className="h-3.5 w-3.5 dark:text-white" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}