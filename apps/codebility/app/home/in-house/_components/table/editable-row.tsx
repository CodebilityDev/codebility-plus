import { Codev } from "@/types/home/codev";
import { Check, Plus, Trash2, X } from "lucide-react";

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
import { columns } from "./columns";

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

interface EditableRowProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
}

export function EditableRow({ data, onSave, onCancel }: EditableRowProps) {
  const { data: formData, handleChange, isSubmitting } = useCodevForm(data);

  const renderCell = (key: keyof Codev) => {
    switch (key) {
      case "internal_status":
        return (
          <Select
            value={formData[key] || "none"}
            onValueChange={(value) =>
              handleChange(key, value === "none" ? "" : value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        );

      case "type":
        return (
          <Select
            value={formData[key] || "none"}
            onValueChange={(value) =>
              handleChange(key, value === "none" ? "" : value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "main_position":
        return (
          <Select
            value={formData[key]}
            onValueChange={(value) => handleChange(key, value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
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
        );

      case "projects":
        return (
          <div className="flex flex-col gap-2">
            {formData.projects?.map((project, index) => (
              <div key={project.id} className="flex items-center gap-2">
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
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const updatedProjects = formData.projects?.filter(
                      (_, i) => i !== index,
                    );
                    handleChange("projects", updatedProjects);
                  }}
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const updatedProjects = [
                  ...(formData.projects || []),
                  { id: Date.now().toString(), name: "" },
                ];
                handleChange("projects", updatedProjects);
              }}
              disabled={isSubmitting}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        );

      case "nda_status":
        return (
          <Select
            value={formData[key]}
            onValueChange={(value) => handleChange(key, value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
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
        );

      default:
        return (
          <Input
            value={formData[key] || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={isSubmitting}
          />
        );
    }
  };

  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.key}>
          {renderCell(column.key as keyof Codev)}
        </TableCell>
      ))}
      <TableCell>
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => onSave(formData)}
            disabled={isSubmitting}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
