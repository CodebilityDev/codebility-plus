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

      const updatedJob = {
        ...job,
        ...data,
        requirements: requirementsArray,
        updated_at: new Date().toISOString(),
      };

      // Here you would typically send to your backend
      console.log("Updating job:", updatedJob);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Job Updated Successfully",
        description: `${data.title} has been updated.`,
      });
      
      onClose();
      onJobUpdated?.();
    } catch (error) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-white">
            Edit Job Listing
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">
                Job Title *
              </Label>
              <Input
                id="title"
                {...register("title")}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., Senior Full Stack Developer"
              />
              {errors.title && (
                <p className="text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-300">
                  Department *
                </Label>
                <Input
                  id="department"
                  {...register("department")}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., Engineering"
                />
                {errors.department && (
                  <p className="text-sm text-red-400">{errors.department.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">
                  Location *
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., Manila, Philippines"
                />
                {errors.location && (
                  <p className="text-sm text-red-400">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">
                  Job Type *
                </Label>
                <Select
                  onValueChange={(value: any) => setValue("type", value)}
                  defaultValue={job.type}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-gray-300">
                  Experience Level *
                </Label>
                <Select
                  onValueChange={(value: any) => setValue("level", value)}
                  defaultValue={job.level}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Entry">Entry</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range" className="text-gray-300">
                Salary Range (Optional)
              </Label>
              <Input
                id="salary_range"
                {...register("salary_range")}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="e.g., ₱80,000 - ₱120,000"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-700 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="remote" className="text-gray-300">
                  Remote Position
                </Label>
                <p className="text-sm text-gray-500">
                  This position allows remote work
                </p>
              </div>
              <Switch
                id="remote"
                checked={watchRemote}
                onCheckedChange={(checked) => setValue("remote", checked)}
                className="data-[state=checked]:bg-customViolet-100"
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Job Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Job Description *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
              />
              {errors.description && (
                <p className="text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-gray-300">
                Requirements * (One per line)
              </Label>
              <Textarea
                id="requirements"
                {...register("requirements")}
                className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                placeholder="5+ years experience&#10;React/Next.js&#10;Node.js&#10;PostgreSQL"
              />
              {errors.requirements && (
                <p className="text-sm text-red-400">{errors.requirements.message}</p>
              )}
              <p className="text-xs text-gray-500">
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
              className="flex-1"
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
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}