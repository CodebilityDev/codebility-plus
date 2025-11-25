"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, GripVertical, ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { H1 } from "@/components/shared/dashboard";
import PageContainer from "../../../_components/PageContainer";
import QuestionForm from "./_components/QuestionForm";
import { createClientClientComponent } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  getSurveyQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
} from "../questions/actions";

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

    // Swap
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/home/settings/surveys")}
          className="text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Surveys
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <H1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {survey?.title || "Survey Builder"}
          </H1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {survey?.description || "Build your survey questions"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push(`/home/settings/surveys/${surveyId}/results`)}
            variant="outline"
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BarChart3 className="h-4 w-4" />
            View Results
          </Button>
          <Button
            onClick={() => {
              setEditingQuestion(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Question Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
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
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
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
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Reorder Handle */}
                <div className="flex flex-col gap-1 pt-1">
                  <button
                    onClick={() => moveQuestion(index, "up")}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-500 text-center">{index + 1}</span>
                </div>

                {/* Question Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {question.question_text}
                        </h3>
                        {question.settings.required && (
                          <span className="text-red-500 text-sm">*</span>
                        )}
                      </div>
                      {question.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {question.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {questionTypeLabels[question.question_type] || question.question_type}
                        </span>
                        {question.settings.required && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                            Required
                          </span>
                        )}
                      </div>

                      {/* Show options for multiple choice/checkbox */}
                      {(question.question_type === "multiple_choice" || question.question_type === "checkbox") && (
                        <div className="mt-3 space-y-1">
                          {question.options.map((option, i) => (
                            <div key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <span className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0" />
                              {option}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show rating scale */}
                      {question.question_type === "rating" && (
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          Rating: {question.settings.min_rating} to {question.settings.max_rating}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
