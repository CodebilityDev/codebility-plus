"use client";

import { useEffect, useState } from "react";
import SwitchStatusButton from "@/Components/ui/SwitchStatusButton";
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

// If you have a separate "Role" interface:
export interface Role {
  id: number;
  name: string;
}

interface EditableRowProps {
  data: Codev; // The codev row
  onSave: (data: Codev) => void;
  onCancel: () => void;
  roles: Role[]; // Pre-fetched roles
}

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

  // --- 1) LOCAL EDIT STATE ---
  // We'll clone the incoming "data" into our own local "editForm"
  const [editForm, setEditForm] = useState<Codev>(data);

  // For local preview of image if user uploads a new one
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    data.image_url || null,
  );

  const [positions, setPositions] = useState<Position[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // --- 2) FETCH POSITIONS (once) ---
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

  // --- 3) LOCAL CHANGE HANDLER ---
  // This simply updates `editForm` in local state, no server call
  const handleLocalChange = (key: keyof Codev, value: any) => {
    setEditForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // --- 4) IMAGE UPLOAD (local + supabase storage) ---
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to your Supabase bucket
      const  publicUrl = await uploadImage(file, {
        bucket: "codebility",
        folder: "profileImage",
      });

      // Save the final image URL into local form
      handleLocalChange("image_url", publicUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // --- 5) SAVE CHANGES ON CLICK OF CHECK ICON ---
  // Merges "projects" pivot changes + codev table updates
  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      // We'll remove `projects` from the rest
      const { id, projects, ...rest } = editForm;

      // 1) Clear + re-insert pivot if `projects` changed
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

      // 2) Build object for codev table
      //    We'll store allowed columns in `updateFields`
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
      ];

      // This can be a loose type so TS doesn't complain
      const updateFields: Record<string, unknown> = {};

      // Cast rest so TypeScript doesn't complain about indexing
      const restTyped = rest as Partial<Codev>;

      for (const key of allowedFields) {
        // If it exists in `restTyped`, we add it to `updateFields`
        if (Object.prototype.hasOwnProperty.call(restTyped, key)) {
          updateFields[key] = restTyped[key];
        }
      }

      // 3) Update codev table if there's anything to update
      if (Object.keys(updateFields).length > 0) {
        const { error } = await supabase
          .from("codev")
          .update(updateFields)
          .eq("id", id);
        if (error) throw error;
      }

      toast.success("Member updated successfully");
      onSave(editForm); // pass updated data back up
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 6) RENDER FUNCTION FOR EACH CELL ---
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
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
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
            value={editForm.internal_status || undefined}
            onValueChange={(value: InternalStatus) =>
              handleLocalChange("internal_status", value)
            }
            disabled={isSubmitting || isUploading}
          >
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 border text-black dark:text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-black dark:text-white">
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
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 border text-black dark:text-white">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-black dark:text-white">
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
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 border text-black dark:text-white">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-black dark:text-white">
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
          <ProjectSelect
            value={editForm.projects || []}
            onChange={(projects) => handleLocalChange("projects", projects)}
            disabled={isSubmitting || isUploading}
          />
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
            <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 border text-black dark:text-white">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-300 text-black dark:text-white">
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

      default:
        // For example: first_name, last_name, portfolio_website, etc.
        return (
          <Input
            value={String(editForm[key] || "")}
            onChange={(e) => handleLocalChange(key, e.target.value)}
            disabled={isSubmitting || isUploading}
            className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 border text-black dark:text-white"
          />
        );
    }
  };

  return (
    <TableRow className="bg-light-200 dark:bg-dark-200 hover:bg-light-300 dark:hover:bg-dark-300">
      <TableCell className="p-2">{renderCell("image_url")}</TableCell>
      <TableCell className="p-2 pb-6">{renderCell("first_name")}</TableCell>
      <TableCell className="p-2 pb-6">{renderCell("last_name")}</TableCell>
      <TableCell className="p-2 pb-6">{renderCell("email_address")}</TableCell>
      <TableCell className="p-2">{renderCell("internal_status")}</TableCell>
      <TableCell className="p-2">{renderCell("role_id")}</TableCell>
      <TableCell className="p-2">{renderCell("display_position")}</TableCell>
      <TableCell className="p-2">{renderCell("projects")}</TableCell>
      <TableCell className="p-2">{renderCell("nda_status")}</TableCell>
      <TableCell className="p-2 pb-6">
        {renderCell("portfolio_website")}
      </TableCell>
      <TableCell className="p-2">{renderCell("availability_status")}</TableCell>

      <TableCell className="p-2">
        <div className="flex space-x-2">
          {/* Save button -> calls handleSave (single server update) */}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting || isUploading}
            className="hover:bg-green dark:hover:bg-green bg-white text-white dark:bg-transparent"
          >
            <Check className="text-black-100 h-4 w-4 dark:text-white" />
          </Button>
          {/* Cancel button -> reverts changes (via parent) */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
            className="hover:bg-red-500/20 hover:text-red-500"
          >
            <X className="h-4 w-4 dark:text-white" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
