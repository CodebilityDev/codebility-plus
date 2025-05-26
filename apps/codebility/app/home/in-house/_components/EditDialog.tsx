import { useEffect, useState } from "react";
import { Codev, Project } from "@/types/home/codev";

import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { createClientClientComponent } from "@/utils/supabase/client";

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: Codev;
  onSave: (updated: Codev) => void;
}

const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Deployed", value: "DEPLOYED" },
  { label: "Training", value: "TRAINING" },
  { label: "Vacation", value: "VACATION" },
  { label: "Busy", value: "BUSY" },
  { label: "Client Ready", value: "CLIENT_READY" },
];

export function EditDialog({ isOpen, onClose, data, onSave }: EditDialogProps) {
  const [formData, setFormData] = useState<Codev>(data);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientClientComponent();

  // Fetch available projects
  useEffect(() => {
    async function fetchProjects() {
      const { data: projects, error } = await supabase
        .from("project")
        .select("*");

      if (!error && projects) {
        setAvailableProjects(projects);
      }
    }

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen, supabase]);

  const handleChange = (key: keyof Codev, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-light-300 dark:bg-dark-100 dark:text-light-900 text-black">
        <DialogHeader>
          <DialogTitle>Edit Member Information</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className="bg-light-800 dark:bg-dark-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className="bg-light-800 dark:bg-dark-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.internal_status}
              onValueChange={(value) => handleChange("internal_status", value)}
            >
              <SelectTrigger className="bg-light-800 dark:bg-dark-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Projects</Label>
            <div className="bg-light-800 dark:bg-dark-200 max-h-32 space-y-2 overflow-y-auto rounded-md border p-2">
              {availableProjects.map((project) => (
                <label key={project.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.projects?.some(
                      (p) => p.id === project.id,
                    )}
                    onChange={() => handleProjectChange(project.id)}
                    className="border-gray rounded"
                  />
                  <span>{project.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
