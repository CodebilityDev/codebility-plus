"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { H1 } from "@/components/shared/dashboard";
import { createClientClientComponent } from "@/utils/supabase/client";
import {
  ArrowLeft,
  BarChart3,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@codevs/ui/button";

import PageContainer from "../../../_components/PageContainer";
import {
  createQuestion,
  deleteQuestion,
  getSurveyQuestions,
  reorderQuestions,
  updateQuestion,
} from "../questions/actions";
import QuestionForm from "./_components/QuestionForm";

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
  order_index: number;
}

interface Survey {
  id: string;
  title: string;
  description: string;
}

const questionTypeLabels: Record<string, string> = {
  text: "Short Text",
  textarea: "Long Text",
  multiple_choice: "Multiple Choice",
  checkbox: "Checkboxes",
  rating: "Rating",
  date: "Date",
  email: "Email",
  number: "Number",
};

export default function SurveyBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSurvey();
    fetchQuestions();
  }, [surveyId]);

  const fetchSurvey = async () => {
    const supabase = createClientClientComponent();
    if (!supabase) {
      toast.error("Failed to initialize database client");
      return;
    }
    const { data, error } = await supabase
      .from("surveys")
      .select("id, title, description")
      .eq("id", surveyId)
      .single();

    if (error) {
      console.error("Error fetching survey:", error);
      toast.error("Failed to fetch survey");
      return;
    }

    setSurvey(data);
  };

  const fetchQuestions = async () => {
    setLoading(true);
    const result = await getSurveyQuestions(surveyId);

    if (result.error) {
      toast.error(result.error);
    } else {
      setQuestions(result.data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);

    const questionData = {
      ...data,
      order_index: editingQuestion?.order_index ?? questions.length,
    };

    const result = editingQuestion
      ? await updateQuestion(editingQuestion.id, questionData)
      : await createQuestion(surveyId, questionData);

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingQuestion ? "Question updated" : "Question added");
      setShowForm(false);
      setEditingQuestion(null);
      fetchQuestions();
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    const result = await deleteQuestion(questionId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Question deleted");
      fetchQuestions();
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const moveQuestion = async (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    if (index < 0 || index >= newQuestions.length) return;

    // Swap
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex] as Question,
      newQuestions[index] as Question,
    ];

    // Update order_index
    const updates = newQuestions.map((q, i) => ({
      id: q.id,
      order_index: i,
    }));

    setQuestions(newQuestions);

    const result = await reorderQuestions(updates);
    if (result.error) {
      toast.error("Failed to reorder questions");
      fetchQuestions(); // Revert
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-violet-500"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/home/settings/surveys")}
          className="text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Surveys
        </Button>
      </div>

      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <H1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {survey?.title || "Survey Builder"}
          </H1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {survey?.description || "Build your survey questions"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() =>
              router.push(`/home/settings/surveys/${surveyId}/results`)
            }
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <BarChart3 className="h-4 w-4" />
            View Results
          </Button>
          <Button
            onClick={() => {
              setEditingQuestion(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Question Form */}
      {showForm && editingQuestion !== undefined && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editingQuestion ? "Edit Question" : "Add New Question"}
          </h2>
          <QuestionForm
            question={editingQuestion}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingQuestion(null);
            }}
            loading={submitting}
          />
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No questions yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Add your first question to start building the survey
                </p>
              </div>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start gap-4">
                {/* Reorder Handle */}
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => moveQuestion(index, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <span className="text-center text-xs text-gray-500">
                    {index + 1}
                  </span>
                </div>

                {/* Question Content */}
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {question.question_text}
                        </h3>
                        {question.settings.required && (
                          <span className="text-sm text-red-500">*</span>
                        )}
                      </div>
                      {question.description && (
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                          {question.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {questionTypeLabels[question.question_type] ||
                            question.question_type}
                        </span>
                        {question.settings.required && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200">
                            Required
                          </span>
                        )}
                      </div>

                      {/* Show options for multiple choice/checkbox */}
                      {(question.question_type === "multiple_choice" ||
                        question.question_type === "checkbox") && (
                        <div className="mt-3 space-y-1">
                          {question.options.map((option, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <span className="h-4 w-4 flex-shrink-0 rounded border border-gray-300 dark:border-gray-600" />
                              {option}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show rating scale */}
                      {question.question_type === "rating" && (
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          Rating: {question.settings.min_rating} to{" "}
                          {question.settings.max_rating}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageContainer>
  );
}
