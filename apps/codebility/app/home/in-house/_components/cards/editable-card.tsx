import { INTERNAL_STATUS } from "@/constants/internal_status";
import { Codev, InternalStatus, Position, Project } from "@/types/home/codev";
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
import { StatusBadge } from "../shared/status-badge";

interface EditableCardProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
}

export function EditableCard({ data, onSave, onCancel }: EditableCardProps) {
  const { data: formData, handleChange, isSubmitting } = useCodevForm(data);

  // Ensure positions are handled correctly
  const positions: Position[] = (formData.positions || []).map((pos) => {
    if (typeof pos === "string") {
      // Convert string to bigint for id and use the string for name
      return { id: BigInt(pos), name: pos } as Position;
    }
    return pos; // Return as-is if already a Position object
  });

  // Ensure projects are handled correctly
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
          <Label>Status</Label>
          <Select
            value={formData.internal_status || undefined}
            onValueChange={(value) => handleChange("internal_status", value)}
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
              {Object.entries(INTERNAL_STATUS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <StatusBadge status={key as InternalStatus} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Position</Label>
          <Select
            value={
              typeof formData.display_position === "string"
                ? formData.display_position
                : undefined
            }
            onValueChange={(value) => handleChange("display_position", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem
                  key={position.id}
                  value={position.name ?? "Unnamed Position"}
                >
                  {position.name || "Unnamed Position"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Projects</Label>
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div
                key={typeof project === "string" ? project : project.id}
                className="flex items-center space-x-2"
              >
                <Input
                  value={typeof project === "string" ? project : project.name}
                  onChange={(e) => {
                    const updatedProjects = [...projects];
                    updatedProjects[index] = {
                      ...project,
                      name: e.target.value,
                    } as Project;
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
                const updatedProjects = [
                  ...projects,
                  { id: Date.now().toString(), name: "" } as Project,
                ];
                handleChange("projects", updatedProjects);
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
            value={formData.nda_status ? "Received" : "Not Received"}
            onValueChange={(value) =>
              handleChange("nda_status", value === "Received")
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Received">Received</SelectItem>
              <SelectItem value="Not Received">Not Received</SelectItem>
            </SelectContent>
          </Select>
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
