import { useEffect, useState } from "react";
import { Codev, InternalStatus, Position, Project } from "@/types/home/codev";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import { uploadImage } from "@/utils/uploadImage";
import { Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { Switch } from "@codevs/ui/switch";
import { ScrollArea } from "@codevs/ui/scroll-area";
import { createClientClientComponent } from "@/utils/supabase/client";

export interface Role {
  id: number;
  name: string;
}

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: Codev;
  onSave: (updated: Codev) => void;
  roles: Role[];
}

export function EditDialog({ isOpen, onClose, data, onSave, roles }: EditDialogProps) {
  const [formData, setFormData] = useState<Codev>(data);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(data.image_url || null);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    setFormData(data);
    setUploadedImage(data.image_url || null);
  }, [data]);

  // Fetch positions and projects
  useEffect(() => {
    if (!supabase) return;

    async function fetchData() {
      const [projectsResult, positionsResult] = await Promise.all([
        supabase.from("projects").select("*"),
        supabase.from("positions").select("id, name")
      ]);

      if (!projectsResult.error && projectsResult.data) {
        setAvailableProjects(projectsResult.data);
      }

      if (!positionsResult.error && positionsResult.data) {
        setPositions(positionsResult.data);
      }
    }

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, supabase]);

  const handleChange = (key: keyof Codev, value: any) => {
    setFormData((prev) => ({
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

      handleChange("image_url", publicUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = availableProjects.find((p) => p.id === projectId);
    if (!project) return;

    const currentProjects = formData.projects || [];
    const isProjectSelected = currentProjects.some((p) => p.id === projectId);

    const updatedProjects = isProjectSelected
      ? currentProjects.filter((p) => p.id !== projectId)
      : [...currentProjects, project];

    handleChange("projects", updatedProjects);
  };

  const handleSubmit = async () => {
    if (!supabase) return;

    setIsLoading(true);
    try {
      const { id, projects, ...rest } = formData;

      // Handle project associations
      if (projects) {
        const { error: deleteError } = await supabase
          .from("project_members")
          .delete()
          .eq("codev_id", id);

        if (deleteError) throw deleteError;

        for (const project of projects) {
          const { error: insertError } = await supabase
            .from("project_members")
            .insert({
              codev_id: id,
              project_id: project.id,
              role: project.role || "member",
            });
          if (insertError) throw insertError;
        }
      }

      // Update codev record
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
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-light-300 dark:bg-dark-100 dark:text-light-900 text-black max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Member Information</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6 py-4">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="upload-avatar" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </div>
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
                </Label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max. 5MB)</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    className="bg-light-800 dark:bg-dark-200"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    className="bg-light-800 dark:bg-dark-200"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email_address}
                  onChange={(e) => handleChange("email_address", e.target.value)}
                  className="bg-light-800 dark:bg-dark-200"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={formData.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  className="bg-light-800 dark:bg-dark-200"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label>Portfolio Website</Label>
                <Input
                  type="url"
                  value={formData.portfolio_website || ""}
                  onChange={(e) => handleChange("portfolio_website", e.target.value)}
                  className="bg-light-800 dark:bg-dark-200"
                  disabled={isLoading}
                  placeholder="https://"
                />
              </div>
            </div>

            {/* Role & Status */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Role & Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Internal Status *</Label>
                  <Select
                    value={formData.internal_status}
                    onValueChange={(value: InternalStatus) => handleChange("internal_status", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-light-800 dark:bg-dark-200">
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

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={String(formData.role_id || "")}
                    onValueChange={(value) => handleChange("role_id", parseInt(value))}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-light-800 dark:bg-dark-200">
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

              <div className="space-y-2">
                <Label>Display Position</Label>
                <Select
                  value={formData.display_position || ""}
                  onValueChange={(value) => handleChange("display_position", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-light-800 dark:bg-dark-200">
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

              <div className="space-y-2">
                <Label>Date Joined</Label>
                <Input
                  type="date"
                  value={
                    formData.date_joined
                      ? new Date(formData.date_joined).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const dateValue = e.target.value
                      ? new Date(e.target.value).toISOString()
                      : null;
                    handleChange("date_joined", dateValue);
                  }}
                  className="bg-light-800 dark:bg-dark-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Additional Settings</h3>

              <div className="flex items-center justify-between py-2 px-4 rounded-md bg-light-800 dark:bg-dark-200">
                <div>
                  <Label htmlFor="availability" className="font-medium">Availability Status</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Toggle member availability</p>
                </div>
                <Switch
                  id="availability"
                  checked={formData.availability_status ?? false}
                  onCheckedChange={(checked) => handleChange("availability_status", checked)}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                />
              </div>

              <div className="flex items-center justify-between py-2 px-4 rounded-md bg-light-800 dark:bg-dark-200">
                <div>
                  <Label htmlFor="nda" className="font-medium">NDA Signed</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Non-disclosure agreement status</p>
                </div>
                <Switch
                  id="nda"
                  checked={formData.nda_status ?? false}
                  onCheckedChange={(checked) => handleChange("nda_status", checked)}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
                />
              </div>
            </div>

            {/* Projects */}
            {availableProjects.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Projects</h3>
                <div className="bg-light-800 dark:bg-dark-200 max-h-48 space-y-2 overflow-y-auto rounded-md border border-gray-300 dark:border-gray-600 p-4">
                  {availableProjects.length === 0 ? (
                    <p className="text-sm text-gray-500">No projects available</p>
                  ) : (
                    availableProjects.map((project) => (
                      <label key={project.id} className="flex items-center space-x-3 cursor-pointer hover:bg-light-700 dark:hover:bg-dark-300 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={formData.projects?.some((p) => p.id === project.id)}
                          onChange={() => handleProjectChange(project.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                        <span className="text-sm">{project.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isUploading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
