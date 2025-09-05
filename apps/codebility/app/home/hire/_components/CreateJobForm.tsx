"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, X } from "lucide-react";
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
import { createClientClientComponent } from "@/utils/supabase/client";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleType: z.enum(["existing", "custom"]),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]),
  level: z.enum(["Entry", "Mid", "Senior", "Lead"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  salary_range: z.string().optional(),
  remote: z.boolean(),
});

type JobFormData = z.infer<typeof jobSchema>;

interface CreateJobFormProps {
  onJobCreated?: () => void;
}

export default function CreateJobForm({ onJobCreated }: CreateJobFormProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [positions, setPositions] = useState<string[]>([]);
  const [titleType, setTitleType] = useState<"existing" | "custom">("existing");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      remote: false,
      type: "Full-time",
      level: "Mid",
      titleType: "existing",
    },
  });

  const watchRemote = watch("remote");
  const watchTitleType = watch("titleType");

  useEffect(() => {
    const fetchPositions = async () => {
      const supabase = createClientClientComponent();
      
      // Fetch distinct display_positions from codev table
      const { data, error } = await supabase
        .from('codev')
        .select('display_position')
        .not('display_position', 'is', null)
        .order('display_position');

      if (data) {
        // Get unique positions and filter out CEO/Founder
        const uniquePositions = [...new Set(data.map(item => item.display_position))]
          .filter(Boolean)
          .filter(position => !position.toLowerCase().includes('ceo') && !position.toLowerCase().includes('founder'));
        setPositions(uniquePositions);
      }
    };

    if (isOpen) {
      fetchPositions();
    }
  }, [isOpen]);

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    
    try {
      const supabase = createClientClientComponent();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create a job listing");
      }

      // Convert requirements string to array
      const requirementsArray = data.requirements
        .split('\n')
        .map(req => req.trim())
        .filter(req => req.length > 0);

      // Save to database
      const { error } = await supabase
        .from('job_listings')
        .insert({
          title: data.title,
          department: 'General', // Default department since we're removing this field
          location: data.remote ? 'Remote' : 'Philippines', // Default location based on remote status
          type: data.type,
          level: data.level,
          description: data.description,
          requirements: requirementsArray,
          salary_range: data.salary_range || null,
          remote: data.remote,
          status: 'active',
          posted_date: new Date().toISOString().split('T')[0],
          created_by: user.id
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Job Posted Successfully",
        description: `${data.title} has been posted and is now live.`,
      });
      
      reset();
      setIsOpen(false);
      onJobCreated?.();
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Failed to post job",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="purple"
        className="flex items-center gap-2 max-w-[200px]"
      >
        <Plus className="h-4 w-4" />
        Create Job Listing
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-light text-white">
              Create New Job Listing
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Basic Information</h3>
              
              {/* Job Title Selection */}
              <div className="space-y-2">
                <Label className="text-gray-300">
                  Job Title Type *
                </Label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      value="existing"
                      checked={watchTitleType === "existing"}
                      onChange={(e) => {
                        setValue("titleType", "existing");
                        setValue("title", ""); // Reset title when changing type
                      }}
                      className="text-customViolet-100"
                    />
                    Select from existing positions
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="radio"
                      value="custom"
                      checked={watchTitleType === "custom"}
                      onChange={(e) => {
                        setValue("titleType", "custom");
                        setValue("title", ""); // Reset title when changing type
                      }}
                      className="text-customViolet-100"
                    />
                    Enter custom title
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Job Title *
                </Label>
                {watchTitleType === "existing" ? (
                  <Select
                    onValueChange={(value) => setValue("title", value)}
                    {...register("title")}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {positions.map((position) => (
                        <SelectItem 
                          key={position} 
                          value={position}
                          className="text-gray-300 hover:bg-gray-700"
                        >
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="title"
                    {...register("title")}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="e.g., Senior Full Stack Developer"
                  />
                )}
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-300">
                    Job Type *
                  </Label>
                  <Select
                    onValueChange={(value: any) => setValue("type", value)}
                    defaultValue="Full-time"
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
                    defaultValue="Mid"
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
                    Creating...
                  </>
                ) : (
                  "Create Job Listing"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}