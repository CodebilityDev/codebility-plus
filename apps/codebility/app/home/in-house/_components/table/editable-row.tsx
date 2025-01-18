import { Codev } from "@/types/home/codev";
import { Check, X } from "lucide-react";

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
import { InternalStatus } from "../shared/status-badge";
import { columns } from "./columns";

// Constants for select options
const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE", color: "text-codeGreen" },
  { label: "Deployed", value: "DEPLOYED", color: "text-codeViolet" },
  { label: "Training", value: "TRAINING", color: "text-codeYellow" },
  { label: "Vacation", value: "VACATION", color: "text-codeBlue" },
  { label: "Busy", value: "BUSY", color: "text-codeRed" },
  { label: "Client Ready", value: "CLIENTREADY", color: "text-codePurple" },
  { label: "Blocked", value: "BLOCKED", color: "text-gray" },
  { label: "Graduated", value: "GRADUATED", color: "text-gray" },
] as const;

const TYPE_OPTIONS = [
  { label: "Intern", value: "INTERN" },
  { label: "In-house", value: "INHOUSE" },
] as const;

const POSITION_OPTIONS = [
  { label: "Front End Developer", value: "Front End Developer" },
  { label: "Back End Developer", value: "Back End Developer" },
  { label: "Full Stack Developer", value: "Full Stack Developer" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
  { label: "Project Manager", value: "Project Manager" },
] as const;

const NDA_OPTIONS = [
  { label: "Received", value: "RECEIVED" },
  { label: "Sent", value: "SENT" },
  { label: "Not Required", value: "NOT_REQUIRED" },
] as const;

interface EditableRowProps {
  data: Codev;
  onSave: (data: Codev) => void;
  onCancel: () => void;
}

export function EditableRow({ data, onSave, onCancel }: EditableRowProps) {
  const { data: formData, handleChange, isSubmitting } = useCodevForm(data);

  // Input fields that should be handled with text input
  const TEXT_INPUT_FIELDS = [
    "first_name",
    "last_name",
    "email",
    "image_url",
    "portfolio_website",
  ] as const;

  // Fields that should not be editable
  const NON_EDITABLE_FIELDS = [
    "id",
    "user_id",
    "tech_stacks",
    "socials",
    "experiences",
    "education",
    "about",
    "address",
  ] as const;

  const renderCell = (key: keyof Codev) => {
    // Handle text input fields
    if (TEXT_INPUT_FIELDS.includes(key as (typeof TEXT_INPUT_FIELDS)[number])) {
      return (
        <Input
          value={String(formData[key] || "")}
          onChange={(e) => handleChange(key, e.target.value)}
          disabled={isSubmitting}
          className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200"
          placeholder={`Enter ${key.replace(/_/g, " ")}`}
        />
      );
    }

    // Handle non-editable fields
    if (
      NON_EDITABLE_FIELDS.includes(key as (typeof NON_EDITABLE_FIELDS)[number])
    ) {
      return null;
    }

    // Handle specific fields
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
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              {STATUS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={option.color}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "type":
        return (
          <Select
            value={formData.type || undefined}
            onValueChange={(value) => handleChange("type", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
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
            value={formData.main_position || undefined}
            onValueChange={(value) => handleChange("main_position", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
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
          <ProjectSelect
            value={formData.projects || []}
            onChange={(projects) => handleChange("projects", projects)}
            disabled={isSubmitting}
          />
        );

      case "nda_status":
        return (
          <Select
            value={formData.nda_status || undefined}
            onValueChange={(value) => handleChange("nda_status", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200">
              <SelectValue placeholder="Select NDA status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              {NDA_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
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
            disabled={isSubmitting}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="hover:bg-red-500/20 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
