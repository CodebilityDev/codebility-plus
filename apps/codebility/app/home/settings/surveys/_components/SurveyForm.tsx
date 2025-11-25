"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { Label } from "@codevs/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@codevs/ui/select";
import { Switch } from "@codevs/ui/switch";
import { createClientClientComponent } from "@/utils/supabase/client";
import { toast } from "sonner";
import SurveyImageUpload from "./SurveyImageUpload";

const surveySchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(1, "Description is required"),
  is_external: z.boolean().default(false),
  survey_url: z.string().optional(),
  type: z.enum(["general", "feedback", "satisfaction", "research", "onboarding"]),
  image_url: z.string().optional(),
  target_audience: z.enum(["all", "codev", "intern", "hr", "admin"]),
  priority: z.number().min(1).max(100),
  is_active: z.boolean(),
  start_date: z.string(),
  end_date: z.string().optional(),
}).refine((data) => {
  // If external survey, survey_url is required and must be valid
  if (data.is_external) {
    return data.survey_url && z.string().url().safeParse(data.survey_url).success;
  }
  return true;
}, {
  message: "Survey URL is required for external surveys",
  path: ["survey_url"],
});

type SurveyFormData = z.infer<typeof surveySchema>;

interface Survey {
  id: string;
  title: string;
  description: string;
  is_external: boolean;
  survey_url?: string;
  type: "general" | "feedback" | "satisfaction" | "research" | "onboarding";
  image_url?: string;
  target_audience: "all" | "codev" | "intern" | "hr" | "admin";
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
}

interface SurveyFormProps {
  survey?: Survey | null;
  onSuccess: () => void;
}

export default function SurveyForm({ survey, onSuccess }: SurveyFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(survey?.type || "general");
  const [selectedAudience, setSelectedAudience] = useState<string>(survey?.target_audience || "all");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: survey?.title || "",
      description: survey?.description || "",
      is_external: survey?.is_external ?? false,
      survey_url: survey?.survey_url || "",
      type: survey?.type || "general",
      image_url: survey?.image_url || "",
      target_audience: survey?.target_audience || "all",
      priority: survey?.priority || 1,
      is_active: survey?.is_active ?? true,
      start_date: survey?.start_date ? new Date(survey.start_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      end_date: survey?.end_date ? new Date(survey.end_date).toISOString().slice(0, 16) : "",
    },
  });

  const isActive = watch("is_active");
  const isExternal = watch("is_external");

  const onSubmit = async (data: SurveyFormData) => {
    setLoading(true);
    const supabase = createClientClientComponent();

    try {
      const surveyData = {
        title: data.title,
        description: data.description,
        is_external: data.is_external,
        survey_url: data.is_external ? data.survey_url : null,
        type: data.type,
        image_url: data.image_url || null,
        target_audience: data.target_audience,
        priority: data.priority,
        is_active: data.is_active,
        start_date: new Date(data.start_date).toISOString(),
        end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (survey) {
        // Update existing survey
        result = await supabase
          .from("surveys")
          .update(surveyData)
          .eq("id", survey.id);
      } else {
        // Create new survey
        const { data: user } = await supabase.auth.getUser();
        result = await supabase
          .from("surveys")
          .insert({
            ...surveyData,
            created_by: user.user?.id,
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(survey ? "Survey updated successfully" : "Survey created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error saving survey:", error);
      toast.error("Failed to save survey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Survey Type Toggle */}
      <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <Switch
          id="is_external"
          checked={isExternal}
          onCheckedChange={(checked) => setValue("is_external", checked)}
          className="data-[state=checked]:bg-customViolet-100 dark:[&>span]:bg-foreground [&>span]:bg-muted-foreground"
        />
        <div className="flex-1">
          <Label htmlFor="is_external" className="text-foreground dark:text-gray-300 font-medium">
            External Survey
          </Label>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isExternal
              ? "Link to external survey (Google Forms, Typeform, etc.)"
              : "Build survey with questions directly in the app"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground dark:text-gray-300">Title *</Label>
          <Input
            id="title"
            variant="lightgray"
            {...register("title")}
            placeholder="Enter survey title"
            className="rounded"
          />
          {errors.title && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
        </div>

        {isExternal && (
          <div className="space-y-2">
            <Label htmlFor="survey_url" className="text-foreground dark:text-gray-300">Survey URL *</Label>
            <Input
              id="survey_url"
              variant="lightgray"
              {...register("survey_url")}
              placeholder="https://forms.google.com/..."
              className="rounded"
            />
            {errors.survey_url && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.survey_url.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground dark:text-gray-300">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter survey description"
          rows={3}
          className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground min-h-[120px] rounded"
        />
        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Survey Image Upload */}
      <SurveyImageUpload
        value={watch("image_url") || ""}
        onChange={(imageUrl) => setValue("image_url", imageUrl || "")}
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-foreground dark:text-gray-300">Type *</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value);
              setValue("type", value as SurveyFormData["type"]);
            }}
          >
            <SelectTrigger className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground rounded">
              <SelectValue placeholder="Select survey type" />
            </SelectTrigger>
            <SelectContent className="border bg-card dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="satisfaction">Satisfaction</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_audience" className="text-foreground dark:text-gray-300">Target Audience *</Label>
          <Select
            value={selectedAudience}
            onValueChange={(value) => {
              setSelectedAudience(value);
              setValue("target_audience", value as SurveyFormData["target_audience"]);
            }}
          >
            <SelectTrigger className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground rounded">
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent className="border bg-card dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="codev">Codev</SelectItem>
              <SelectItem value="intern">Intern</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.target_audience && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.target_audience.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-foreground dark:text-gray-300">Priority</Label>
          <Input
            id="priority"
            variant="lightgray"
            type="number"
            min="1"
            max="100"
            {...register("priority", { valueAsNumber: true })}
            placeholder="1"
            className="rounded"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Higher number = higher priority</p>
          {errors.priority && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.priority.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date" className="text-foreground dark:text-gray-300">Start Date</Label>
          <Input
            id="start_date"
            variant="lightgray"
            type="datetime-local"
            {...register("start_date")}
            className="rounded"
          />
          {errors.start_date && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date" className="text-foreground dark:text-gray-300">End Date (Optional)</Label>
          <Input
            id="end_date"
            variant="lightgray"
            type="datetime-local"
            {...register("end_date")}
            className="rounded"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">Leave empty for no expiration</p>
          {errors.end_date && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={(checked) => setValue("is_active", checked)}
          className="data-[state=checked]:bg-customViolet-100 dark:[&>span]:bg-foreground [&>span]:bg-muted-foreground"
        />
        <Label htmlFor="is_active" className="text-foreground dark:text-gray-300">Active</Label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          disabled={loading}
          variant="purple"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded"
        >
          {loading ? "Saving..." : survey ? "Update Survey" : "Create Survey"}
        </Button>
      </div>
    </form>
  );
}
