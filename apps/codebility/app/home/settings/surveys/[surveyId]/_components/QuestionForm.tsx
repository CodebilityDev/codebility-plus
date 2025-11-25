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
import { Plus, X } from "lucide-react";

const questionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  description: z.string().optional(),
  question_type: z.enum([
    "text",
    "textarea",
    "multiple_choice",
    "checkbox",
    "rating",
    "date",
    "email",
    "number"
  ]),
  options: z.array(z.string()).default([]),
  settings: z.object({
    required: z.boolean().default(false),
    placeholder: z.string().optional(),
    min_rating: z.number().optional(),
    max_rating: z.number().optional(),
  }).default({ required: false }),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface Question {
  id: string;
  question_text: string;
  description?: string;
  question_type: string;
  options: string[];
  settings: {
    required: boolean;
    placeholder?: string;
    min_rating?: number;
    max_rating?: number;
  };
}

interface QuestionFormProps {
  question?: Question | null;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const QUESTION_TYPES = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "multiple_choice", label: "Multiple Choice (Single)" },
  { value: "checkbox", label: "Multiple Choice (Multiple)" },
  { value: "rating", label: "Rating Scale" },
  { value: "date", label: "Date" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
];

export default function QuestionForm({ question, onSubmit, onCancel, loading }: QuestionFormProps) {
  const [selectedType, setSelectedType] = useState<string>(question?.question_type || "text");
  const [options, setOptions] = useState<string[]>(question?.options || []);
  const [newOption, setNewOption] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: question?.question_text || "",
      description: question?.description || "",
      question_type: question?.question_type as any || "text",
      options: question?.options || [],
      settings: {
        required: question?.settings?.required ?? false,
        placeholder: question?.settings?.placeholder || "",
        min_rating: question?.settings?.min_rating || 1,
        max_rating: question?.settings?.max_rating || 5,
      },
    },
  });

  const questionType = watch("question_type");
  const isRequired = watch("settings.required");

  const needsOptions = questionType === "multiple_choice" || questionType === "checkbox";
  const needsRating = questionType === "rating";

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      setValue("options", updatedOptions);
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    setValue("options", updatedOptions);
  };

  const handleFormSubmit = async (data: QuestionFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Question Type */}
      <div className="space-y-2">
        <Label htmlFor="question_type" className="text-foreground dark:text-gray-300">Question Type *</Label>
        <Select
          value={selectedType}
          onValueChange={(value) => {
            setSelectedType(value);
            setValue("question_type", value as any);
          }}
        >
          <SelectTrigger className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground rounded">
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent className="border bg-card dark:bg-gray-800 dark:border-gray-700">
            {QUESTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <Label htmlFor="question_text" className="text-foreground dark:text-gray-300">Question *</Label>
        <Input
          id="question_text"
          variant="lightgray"
          {...register("question_text")}
          placeholder="Enter your question"
          className="rounded"
        />
        {errors.question_text && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.question_text.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground dark:text-gray-300">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Add help text or instructions"
          rows={2}
          className="border bg-card dark:bg-gray-800 dark:border-gray-700 text-foreground rounded"
        />
      </div>

      {/* Options for Multiple Choice/Checkbox */}
      {needsOptions && (
        <div className="space-y-2">
          <Label className="text-foreground dark:text-gray-300">Options *</Label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  readOnly
                  className="flex-1 rounded bg-gray-50 dark:bg-gray-800"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addOption();
                  }
                }}
                placeholder="Add an option"
                className="flex-1 rounded"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="rounded border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {options.length === 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">At least one option is required</p>
          )}
        </div>
      )}

      {/* Rating Scale Settings */}
      {needsRating && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_rating" className="text-foreground dark:text-gray-300">Min Rating</Label>
            <Input
              id="min_rating"
              type="number"
              variant="lightgray"
              {...register("settings.min_rating", { valueAsNumber: true })}
              className="rounded"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_rating" className="text-foreground dark:text-gray-300">Max Rating</Label>
            <Input
              id="max_rating"
              type="number"
              variant="lightgray"
              {...register("settings.max_rating", { valueAsNumber: true })}
              className="rounded"
            />
          </div>
        </div>
      )}

      {/* Placeholder for text inputs */}
      {(questionType === "text" || questionType === "textarea" || questionType === "email") && (
        <div className="space-y-2">
          <Label htmlFor="placeholder" className="text-foreground dark:text-gray-300">Placeholder (Optional)</Label>
          <Input
            id="placeholder"
            variant="lightgray"
            {...register("settings.placeholder")}
            placeholder="Enter placeholder text"
            className="rounded"
          />
        </div>
      )}

      {/* Required Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={isRequired}
          onCheckedChange={(checked) => setValue("settings.required", checked)}
          className="data-[state=checked]:bg-customViolet-100 dark:[&>span]:bg-foreground [&>span]:bg-muted-foreground"
        />
        <Label htmlFor="required" className="text-foreground dark:text-gray-300">Required Question</Label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          disabled={loading || (needsOptions && options.length === 0)}
          variant="purple"
          className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded"
        >
          {loading ? "Saving..." : question ? "Update Question" : "Add Question"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="rounded border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
