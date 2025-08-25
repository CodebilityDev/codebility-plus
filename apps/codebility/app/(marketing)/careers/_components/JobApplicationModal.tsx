"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/forms/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { JobListing } from "../_types/job-listings";

const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  experience: z.string().min(20, "Please describe your relevant experience"),
  resume: z.any().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing | null;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  job,
}: JobApplicationModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!job) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the application to your backend
      const applicationData = {
        ...data,
        jobId: job.id,
        jobTitle: job.title,
        resume: resumeFile?.name,
        appliedAt: new Date().toISOString(),
      };
      
      console.log("Application submitted:", applicationData);
      
      toast({
        title: "Application Submitted!",
        description: `Your application for ${job.title} has been received. We'll be in touch soon.`,
      });
      
      reset();
      setResumeFile(null);
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
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
            Apply for {job.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-400">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="+63 912 345 6789"
              />
              {errors.phone && (
                <p className="text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Professional Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Professional Links</h3>
            
            <div className="space-y-2">
              <Label htmlFor="linkedIn" className="text-gray-300">
                LinkedIn Profile
              </Label>
              <Input
                id="linkedIn"
                type="url"
                {...register("linkedIn")}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="https://linkedin.com/in/johndoe"
              />
              {errors.linkedIn && (
                <p className="text-sm text-red-400">{errors.linkedIn.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-gray-300">
                Portfolio/Website
              </Label>
              <Input
                id="portfolio"
                type="url"
                {...register("portfolio")}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                placeholder="https://johndoe.com"
              />
              {errors.portfolio && (
                <p className="text-sm text-red-400">{errors.portfolio.message}</p>
              )}
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Application Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-300">
                Relevant Experience *
              </Label>
              <Textarea
                id="experience"
                {...register("experience")}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                placeholder="Describe your relevant experience for this position..."
              />
              {errors.experience && (
                <p className="text-sm text-red-400">{errors.experience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-gray-300">
                Cover Letter *
              </Label>
              <Textarea
                id="coverLetter"
                {...register("coverLetter")}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[150px]"
                placeholder="Tell us why you're interested in this position..."
              />
              {errors.coverLetter && (
                <p className="text-sm text-red-400">{errors.coverLetter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume" className="text-gray-300">
                Resume/CV (PDF, DOC, DOCX - Max 5MB)
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("resume")?.click()}
                  className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
                {resumeFile && (
                  <span className="text-sm text-gray-400">
                    {resumeFile.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
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
                  Submitting...
                </>
              ) : (
                "Submit Application"
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