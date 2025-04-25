import { Codev, InternalStatus, Project } from "@/types/home/codev";
import { Check, Plus, X } from "lucide-react";

import { Button } from "@codevs/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@codevs/ui/card";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

import { useCodevForm } from "../../_hooks/use-codev-form";
import { StatusBadge } from "../shared/StatusBadge";

export interface Role {
  id: number;
  name: string;
}

interface EditableCardProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
  roles: Role[];
}

export function EditableCard({
  data,
  onSave,
  onCancel,
  roles,
}: EditableCardProps) {
  const { data: formData, handleChange, isSubmitting } = useCodevForm(data);
  const projects: Project[] = formData.projects || [];

  return (
    <Card className="w-full max-w-lg p-4">
      <CardHeader className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              disabled={isSubmitting}
              placeholder="First Name"
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              disabled={isSubmitting}
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <Label>Email Address</Label>
          <Input
            value={formData.email_address}
            onChange={(e) => handleChange("email_address", e.target.value)}
            disabled={isSubmitting}
            placeholder="Email Address"
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={formData.internal_status || ""}
            onValueChange={(value) =>
              handleChange("internal_status", value as InternalStatus)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status">
                {formData.internal_status && (
                  <StatusBadge status={formData.internal_status} />
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries({
                TRAINING: "Training",
                GRADUATED: "Graduated",
                INACTIVE: "Inactive",
                MENTOR: "Mentor",
                ADMIN: "Admin",
                DEPLOYED: "Deployed",
              }).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <StatusBadge status={key as InternalStatus} />
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Select Field */}
        <div>
          <Label>Role</Label>
          <Select
            value={formData.role_id ? String(formData.role_id) : ""}
            onValueChange={(value) => handleChange("role_id", Number(value))}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
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

        <div>
          <Label>Display Position</Label>
          <Select
            value={formData.display_position || ""}
            onValueChange={(value) => handleChange("display_position", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {formData.positions?.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Projects</Label>
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div key={project.id} className="flex items-center space-x-2">
                <Input
                  value={project.name}
                  onChange={(e) => {
                    const updatedProjects = [...projects];
                    updatedProjects[index] = {
                      ...project,
                      name: e.target.value,
                    };
                    handleChange("projects", updatedProjects);
                  }}
                  disabled={isSubmitting}
                  placeholder="Project name"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updatedProjects = projects.filter(
                      (_, i) => i !== index,
                    );
                    handleChange("projects", updatedProjects);
                  }}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleChange("projects", [
                  ...projects,
                  {
                    id: crypto.randomUUID(),
                    name: "",
                    start_date: new Date().toISOString(),
                  },
                ]);
              }}
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>
        </div>

        <div>
          <Label>NDA Status</Label>
          <Select
            value={formData.nda_status ? "true" : "false"}
            onValueChange={(value) =>
              handleChange("nda_status", value === "true")
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Signed</SelectItem>
              <SelectItem value="false">Not Signed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Availability</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.availability_status || false}
              onChange={(e) =>
                handleChange("availability_status", e.target.checked)
              }
              disabled={isSubmitting}
              className="toggle"
            />
            <span>
              {formData.availability_status ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(formData)}
          disabled={isSubmitting}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          <Check className="h-4 w-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
