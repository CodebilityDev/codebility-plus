"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/forms/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { Switch } from "@codevs/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { updateJobListing } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobListing } from "@/app/(marketing)/careers/_types/job-listings";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(3, "Location is required"),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  level: z.enum(["Entry", "Mid", "Senior", "Lead"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  salary_range: z.string().optional(),
  remote: z.boolean(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface EditJobModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onJobUpdated?: () => void;
}

export default function EditJobModal({ job, isOpen, onClose, onJobUpdated }: EditJobModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
  });

  const watchRemote = watch("remote");

  useEffect(() => {
    if (job && isOpen) {
      setValue("title", job.title);
      setValue("department", job.department);
      setValue("location", job.location);
      setValue("type", job.type);
      setValue("level", job.level);
      setValue("description", job.description);
      setValue("requirements", job.requirements.join('\n'));
      setValue("salary_range", job.salary_range || "");
      setValue("remote", job.remote);
    }
  }, [job, isOpen, setValue]);

  const onSubmit = async (data: JobFormData) => {
    if (!job) return;


    setIsSubmitting(true);


    try {
      const requirementsArray = data.requirements
        .split('\n')
        .map(req => req.trim())
        .filter(req => req.length > 0);

      // Use server action to update the job
      const result = await updateJobListing(job.id, {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        level: data.level,
        description: data.description,
        requirements: requirementsArray,
        salary_range: data.salary_range || null,
        remote: data.remote,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update job");
      }

      toast({
        title: "Job Updated Successfully",
        description: `${data.title} has been updated.`,
      });

      onJobUpdated?.();
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Failed to update job",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto border bg-card dark:bg-gray dark:border-gray-700"
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-foreground">
            Edit Job Listing
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground dark:text-gray-300">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                className="border bg-card dark:bg-gray dark:border-gray-700 text-foreground"
                placeholder="e.g., Senior Full Stack Developer"
              />
              {errors.title && (
                <p className="text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-foreground dark:text-gray-300">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  {...register("department")}
                  className="border bg-card dark:bg-gray dark:border-gray-600 text-foreground"
                  placeholder="e.g., Engineering"
                />
                {errors.department && (
                  <p className="text-sm text-red-400">{errors.department.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground dark:text-gray-300">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  className="border bg-card dark:bg-gray dark:border-gray-600 text-foreground"
                  placeholder="e.g., Manila, Philippines"
                />
                {errors.location && (
                  <p className="text-sm text-red-400">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground dark:text-gray-300">
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value: any) => setValue("type", value)}
                  defaultValue={job.type}
                >
                  <SelectTrigger className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border bg-card dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-foreground dark:text-gray-300">
                  Experience Level <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value: any) => setValue("level", value)}
                  defaultValue={job.level}
                >
                  <SelectTrigger className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border bg-card dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range" className="text-foreground dark:text-gray-300">
                Salary Range (Optional)
              </Label>
              <Input
                id="salary_range"
                {...register("salary_range")}
                className="border bg-card dark:bg-gray dark:border-gray-600 text-foreground"
                placeholder="e.g., ₱80,000 - ₱120,000"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border dark:border-gray-600 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="remote" className="text-foreground dark:text-gray-300">
                  Remote Position
                </Label>
                <p className="text-sm text-foreground  dark:text-gray-500">
                  This position allows remote work
                </p>
              </div>
              <Switch
                id="remote"
                checked={watchRemote}
                onCheckedChange={(checked) => setValue("remote", checked)}
                className="data-[state=checked]:bg-customViolet-100 [&>span]:bg-muted-foreground dark:[&>span]:bg-foreground"
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Job Details</h3>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground dark:text-gray-300">
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground min-h-[120px]"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              />
              {errors.description && (
                <p className="text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-foreground dark:text-gray-300">
                Requirements <span className="text-red-500">*</span> (One per line)
              </Label>
              <Textarea
                id="requirements"
                {...register("requirements")}
                className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground min-h-[120px]"
                placeholder="5+ years experience&#10;React/Next.js&#10;Node.js&#10;PostgreSQL"
              />
              {errors.requirements && (
                <p className="text-sm text-red-400">{errors.requirements.message}</p>
              )}
              <p className="text-xs text-foreground dark:text-gray-500">
                Enter each requirement on a new line
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="purple"
              disabled={isSubmitting}
              className="flex-1 hover:bg-purple-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Job Listing"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border border-gray-300 dark:border-gray-600 bg-accent hover:bg-gray-300 dark:bg-gray-800 text-foreground dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}