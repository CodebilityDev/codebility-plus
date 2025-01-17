import { useEffect, useState } from "react";
import { Codev, Project } from "@/types/home/codev";
import { Check, X } from "lucide-react";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import { Badge } from "@codevs/ui/badge";
import { Button } from "@codevs/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@codevs/ui/command";
import { Input } from "@codevs/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@codevs/ui/popover";
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
import { columns } from "./columns";

const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE", color: "text-codeGreen" },
  { label: "Deployed", value: "DEPLOYED", color: "text-codeViolet" },
  { label: "Training", value: "TRAINING", color: "text-codeYellow" },
  { label: "Vacation", value: "VACATION", color: "text-codeBlue" },
  { label: "Busy", value: "BUSY", color: "text-codeRed" },
  { label: "Client Ready", value: "CLIENT_READY", color: "text-codePurple" },
  { label: "Blocked", value: "BLOCKED", color: "text-gray" },
  { label: "Graduated", value: "GRADUATED", color: "text-gray" },
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
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const supabase = useSupabase();

  // Fetch available projects
  useEffect(() => {
    async function fetchProjects() {
      const { data: projects } = await supabase
        .from("project")
        .select("*")
        .order("name");

      if (projects) {
        setAvailableProjects(projects);
      }
    }

    fetchProjects();
  }, [supabase]);

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
            value={formData[key] || "none"}
            onValueChange={(value) =>
              handleChange(key, value === "none" ? "" : value)
            }
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
            value={formData[key]}
            onValueChange={(value) => handleChange(key, value)}
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
            value={formData[key]}
            onValueChange={(value) => handleChange(key, value)}
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
        return (
          <Input
            value={formData[key] || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            disabled={isSubmitting}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200"
          />
        );
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
            className="bg-green-500 hover:bg-green-600"
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
