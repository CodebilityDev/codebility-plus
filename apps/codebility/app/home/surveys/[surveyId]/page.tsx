"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { Label } from "@codevs/ui/label";
import { RadioGroup, RadioGroupItem } from "@codevs/ui/radio-group";
import { Checkbox } from "@codevs/ui/checkbox";
import PageContainer from "../../_components/PageContainer";
import { createClientClientComponent } from "@/utils/supabase/client";
import { toast } from "sonner";
import { getSurveyQuestions } from "../../settings/surveys/questions/actions";
import { submitSurveyResponse, hasUserResponded } from "../../settings/surveys/responses/actions";

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
  is_active: boolean;
}

export default function SurveyResponsePage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);

  useEffect(() => {
    fetchSurveyData();
  }, [surveyId]);

  const fetchSurveyData = async () => {
    setLoading(true);

    // Fetch survey
    const supabase = createClientClientComponent();
    const { data: surveyData, error: surveyError } = await supabase
      .from("surveys")
      .select("id, title, description, is_active")
      .eq("id", surveyId)
      .single();

    if (surveyError || !surveyData) {
      toast.error("Survey not found");
      router.push("/home");
      return;
    }

    setSurvey(surveyData);

    // Check if already responded
    const responseCheck = await hasUserResponded(surveyId);
    if (responseCheck.hasResponded) {
      setAlreadyResponded(true);
    }

    // Fetch questions
    const questionsResult = await getSurveyQuestions(surveyId);
    if (questionsResult.error) {
      toast.error(questionsResult.error);
    } else {
      setQuestions(questionsResult.data || []);
    }

    setLoading(false);
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required questions
    const missingRequired = questions.filter(
      (q) => q.settings.required && !answers[q.id]
    );

    if (missingRequired.length > 0) {
      toast.error(`Please answer all required questions`);
      return;
    }

    setSubmitting(true);

    const result = await submitSurveyResponse(surveyId, {
      answers,
      status: "completed",
    });

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Survey submitted successfully!");
      router.push("/home");
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
                  className="text-foreground dark:text-gray-300 cursor-pointer"
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
                  className="text-foreground dark:text-gray-300 cursor-pointer"
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
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white border-green-600"
                    : "border-gray-300 dark:border-gray-600 hover:border-green-500 text-gray-700 dark:text-gray-300"
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

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </PageContainer>
    );
  }

  if (alreadyResponded) {
    return (
      <PageContainer maxWidth="2xl">
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Already Submitted
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You have already submitted a response to this survey. Thank you!
              </p>
            </div>
            <Button
              onClick={() => router.push("/home")}
              className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="3xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Survey Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {survey?.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{survey?.description}</p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="text-red-500">*</span> Required questions
            </p>
          </div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <Label className="text-lg font-semibold text-gray-900 dark:text-gray-100">
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/home")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
            >
              {submitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
