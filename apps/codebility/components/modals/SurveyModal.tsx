"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { Label } from "@codevs/ui/label";
import { RadioGroup, RadioGroupItem } from "@codevs/ui/radio-group";
import { Checkbox } from "@codevs/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";
import { toast } from "sonner";
import { submitSurveyResponse } from "@/app/home/settings/surveys/responses/actions";
import { dismissSurvey } from "@/app/home/settings/surveys/actions";

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

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function SurveyModal() {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "surveyModal";
  const survey = data as Survey;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleDismiss = async () => {
    if (survey?.id) {
      await dismissSurvey(survey.id);
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!survey?.questions) return;

    // Validate required questions
    const missingRequired = survey.questions.filter(
      (q) => q.settings.required && !answers[q.id]
    );

    if (missingRequired.length > 0) {
      toast.error(`Please answer all required questions`);
      return;
    }

    setSubmitting(true);

    const result = await submitSurveyResponse(survey.id, {
      answers,
      status: "completed",
    });

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Survey submitted successfully!");
      setAnswers({});
      onClose();
    }
  };

  const renderQuestion = (question: Question) => {
    const value = answers[question.id];

    switch (question.question_type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={question.question_type}
            value={value || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.settings.placeholder || ""}
            className="rounded"
            required={question.settings.required}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.settings.placeholder || ""}
            rows={4}
            className="rounded"
            required={question.settings.required}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="rounded"
            required={question.settings.required}
          />
        );

      case "multiple_choice":
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={(val) => handleAnswerChange(question.id, val)}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const current = value || [];
                    const updated = checked
                      ? [...current, option]
                      : current.filter((v: string) => v !== option);
                    handleAnswerChange(question.id, updated);
                  }}
                />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "rating":
        const min = question.settings.min_rating || 1;
        const max = question.settings.max_rating || 5;
        const ratings = Array.from({ length: max - min + 1 }, (_, i) => min + i);

        return (
          <div className="flex gap-2">
            {ratings.map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleAnswerChange(question.id, rating)}
                className={`w-12 h-12 rounded-full border-2 font-semibold transition-colors ${
                  value === rating
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-violet-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-violet-500 text-gray-700 dark:text-gray-300"
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!survey) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleDismiss}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto dark:bg-gray-800 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {survey.title}
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400">{survey.description}</p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="text-red-500">*</span> Required questions
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {survey.questions?.map((question, index) => (
            <div
              key={question.id}
              className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <Label className="text-lg font-semibold">
                  {index + 1}. {question.question_text}
                  {question.settings.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {question.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {question.description}
                  </p>
                )}
              </div>
              {renderQuestion(question)}
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleDismiss}
              disabled={submitting}
            >
              Later
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
            >
              {submitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
