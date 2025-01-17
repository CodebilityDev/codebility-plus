import { Codev } from "@/types/home/codev";
import { Check, X } from "lucide-react";

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

const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Deployed", value: "DEPLOYED" },
  { label: "Training", value: "TRAINING" },
  { label: "Vacation", value: "VACATION" },
  { label: "Busy", value: "BUSY" },
  { label: "Client Ready", value: "CLIENT_READY" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Graduated", value: "GRADUATED" },
];

const TYPE_OPTIONS = [
  { label: "Intern", value: "INTERN" },
  { label: "In-house", value: "INHOUSE" },
];

const POSITION_OPTIONS = [
  { label: "Front End Developer", value: "Front End Developer" },
  { label: "Back End Developer", value: "Back End Developer" },
  { label: "Full Stack Developer", value: "Full Stack Developer" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
  { label: "Project Manager", value: "Project Manager" },
];

const NDA_OPTIONS = [
  { label: "Received", value: "RECEIVED" },
  { label: "Sent", value: "SENT" },
  { label: "Not Required", value: "NOT_REQUIRED" },
];

interface EditableCardProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
}

export function EditableCard({ data, onSave, onCancel }: EditableCardProps) {
  const { data: formData, handleChange, isSubmitting } = useCodevForm(data);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-4">
          {/* Name Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                disabled={isSubmitting}
                placeholder="First Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                disabled={isSubmitting}
                placeholder="Last Name"
              />
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.internal_status}
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
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <StatusBadge
                      status={option.value as keyof typeof STATUS_OPTIONS}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Position Section */}
        <div className="space-y-2">
          <Label>Position</Label>
          <Select
            value={formData.main_position}
            onValueChange={(value) => handleChange("main_position", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {POSITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Section */}
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Projects Section */}
        <div className="space-y-2">
          <Label>Projects</Label>
          <div className="space-y-2">
            {formData.projects?.map((project, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={project.name}
                  onChange={(e) => {
                    const updatedProjects = [...(formData.projects || [])];
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
                    const updatedProjects = (formData.projects || []).filter(
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
                  ...(formData.projects || []),
                  { id: Date.now().toString(), name: "" },
                ];
                handleChange("projects", updatedProjects);
              }}
              disabled={isSubmitting}
            >
              Add Project
            </Button>
          </div>
        </div>

        {/* NDA Status Section */}
        <div className="space-y-2">
          <Label>NDA Status</Label>
          <Select
            value={formData.nda_status}
            onValueChange={(value) => handleChange("nda_status", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent>
              {NDA_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} disabled={isSubmitting}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
