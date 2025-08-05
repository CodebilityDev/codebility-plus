"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import { Codev, InternalStatus, Position, Project } from "@/types/home/codev";
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

import { ProjectSelect } from "../shared/ProjectSelect";

export interface Role {
  id: number;
  name: string;
}

interface MobileEditableFormProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
  roles: Role[];
}

const defaultImage = "/assets/svgs/icon-codebility-black.svg";

export function MobileEditableForm({
  data,
  onSave,
  onCancel,
  roles,
}: MobileEditableFormProps) {
  const [supabase, setSupabase] = useState<any>(null);
  const [editForm, setEditForm] = useState<Codev>(data);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    data.image_url || null,
  );
  const [positions, setPositions] = useState<Position[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

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

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

  return (
    <div className="border-light-700 bg-light-300 dark:border-dark-200 dark:bg-dark-100 rounded-lg border p-4">
      {/* Header with photo upload */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {uploadedImage ? (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <label
                  htmlFor="mobile-upload-avatar"
                  className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-gray-200 p-1 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Plus className="h-3 w-3 text-gray-700 dark:text-gray-300" />
                  <input
                    id="mobile-upload-avatar"
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
                htmlFor="mobile-upload-avatar"
                className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Upload className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <input
                  id="mobile-upload-avatar"
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
          <div>
            <h3 className="text-sm font-semibold dark:text-white">Edit Member</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Update information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting || isUploading}
            className="h-8 bg-green-600 px-3 text-white hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting || isUploading}
            className="h-8 px-3 hover:bg-red-500/20 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Form fields in grid */}
      <div className="space-y-3">
        {/* Name fields */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">First Name</label>
            <Input
              value={editForm.first_name || ""}
              onChange={(e) => handleLocalChange("first_name", e.target.value)}
              disabled={isSubmitting || isUploading}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Last Name</label>
            <Input
              value={editForm.last_name || ""}
              onChange={(e) => handleLocalChange("last_name", e.target.value)}
              disabled={isSubmitting || isUploading}
              className="h-8 text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Email</label>
          <Input
            value={editForm.email_address || ""}
            onChange={(e) => handleLocalChange("email_address", e.target.value)}
            disabled={isSubmitting || isUploading}
            className="h-8 text-sm"
          />
        </div>

        {/* Status and Role */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Status</label>
            <Select
              value={editForm.internal_status || undefined}
              onValueChange={(value: InternalStatus) =>
                handleLocalChange("internal_status", value)
              }
              disabled={isSubmitting || isUploading}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INTERNAL_STATUS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Role</label>
            <Select
              value={String(editForm.role_id || "")}
              onValueChange={(value) =>
                handleLocalChange("role_id", parseInt(value))
              }
              disabled={isSubmitting || isUploading}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Position</label>
          <Select
            value={editForm.display_position || ""}
            onValueChange={(value) =>
              handleLocalChange("display_position", value)
            }
            disabled={isSubmitting || isUploading}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.id} value={pos.name || ""}>
                  {pos.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Projects */}
        <div>
          <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Projects</label>
          <ProjectSelect
            value={editForm.projects || []}
            onChange={(projects) => handleLocalChange("projects", projects)}
            disabled={isSubmitting || isUploading}
          />
        </div>

        {/* NDA Status and Availability */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">NDA Status</label>
            <Select
              value={editForm.nda_status ? "Yes" : "No"}
              onValueChange={(value) =>
                handleLocalChange("nda_status", value === "Yes")
              }
              disabled={isSubmitting || isUploading}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select NDA status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Available</label>
            <div className="mt-1">
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
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div>
          <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Portfolio</label>
          <Input
            value={editForm.portfolio_website || ""}
            onChange={(e) => handleLocalChange("portfolio_website", e.target.value)}
            disabled={isSubmitting || isUploading}
            placeholder="https://..."
            className="h-8 text-sm"
          />
        </div>

        {/* Date Joined */}
        <div>
          <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Date Joined</label>
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
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );
}