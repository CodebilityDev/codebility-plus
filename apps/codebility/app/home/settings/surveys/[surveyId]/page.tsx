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
  Share2,
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
import ShareSurveyModal from "../_components/ShareSurveyModal";

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

// Added image_url so we can show the thumbnail in the header
interface Survey {
  id: string;
  title: string;
  description: string;
  type: "general" | "feedback" | "satisfaction" | "research" | "onboarding";
  image_url?: string;
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

// Badge colors matching the list page design
const typeColors: Record<string, string> = {
  general: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  feedback: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  satisfaction: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  research: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  onboarding: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
};

// Question type badge colors
const questionTypeBadgeColors: Record<string, string> = {
  text: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  textarea: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
  multiple_choice: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  checkbox: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  rating: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  date: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
  email: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
  number: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
};

// Reusable thumbnail — handles broken/missing image_url with a colored fallback
function SurveyThumbnail({
  imageUrl,
  title,
  size = "md",
}: {
  imageUrl?: string;
  title: string;
  size?: "sm" | "md";
}) {
  const [imgError, setImgError] = useState(false);

  // h-14 w-14 for header (md), h-10 w-10 for smaller contexts (sm)
  const sizeClass = size === "sm" ? "h-10 w-10 rounded-xl" : "h-14 w-14 rounded-2xl";
  const logoSizeClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const showFallback = !imageUrl || imgError;

  return (
    <div className={`flex-shrink-0 overflow-hidden border border-white/10 bg-gray-900 flex items-center justify-center ${sizeClass}`}>
      <img
        src={showFallback ? "/assets/svgs/codebility-white.svg" : imageUrl!}
        alt={title}
        className={showFallback
          ? `${logoSizeClass} object-contain opacity-50`
          : "h-full w-full object-cover"
        }
        onError={() => {
          if (!imgError) {
            console.error("[SurveyThumbnail] Failed to load image_url:", imageUrl);
            setImgError(true);
          }
        }}
      />
    </div>
  );
}

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
  const [shareModalOpen, setShareModalOpen] = useState(false);

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
      // Added image_url and type so we can render the thumbnail + type badge
      .select("id, title, description, image_url, type")
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
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex] as Question,
      newQuestions[index] as Question,
    ];
    const updates = newQuestions.map((q, i) => ({ id: q.id, order_index: i }));
    setQuestions(newQuestions);
    const result = await reorderQuestions(updates);
    if (result.error) {
      toast.error("Failed to reorder questions");
      fetchQuestions();
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-violet-500" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="2xl">
      {/* ── Back nav ── */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/home/settings/surveys")}
          className="gap-2 rounded-xl text-gray-400 hover:bg-white/10 hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Surveys
        </Button>
      </div>

      {/* ── Header: thumbnail + title + actions ── */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {/* Survey image thumbnail with broken-image fallback */}
          {survey && (
            <SurveyThumbnail
              imageUrl={survey.image_url}
              title={survey.title}
              size="md"
            />
          )}
          <div>
            <div className="mb-1 flex items-center gap-3">
              <H1 className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent pt-7">
                {survey?.title || "Survey Builder"}
              </H1>
              {/* Type badge */}
              {survey?.type && (
                <span className={`rounded-full mt-3 px-2.5 py-0.5 text-xs font-medium capitalize ${typeColors[survey.type]}`}>
                  {survey.type}
                </span>
              )}
            </div>
            <p className="text-[clamp(0.875rem,1.8vw,1rem)] text-gray-400 mt-[-10px]">
              {survey?.description || "Build your survey questions"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShareModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 rounded-l border-violet-500/40 text-violet-400 hover:bg-violet-500/15 hover:text-violet-300"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            onClick={() => router.push(`/home/settings/surveys/${surveyId}/results`)}
            variant="outline"
            className="flex items-center gap-2 rounded-l border-white/15 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <BarChart3 className="h-4 w-4" />
            View Results
          </Button>
          <Button
            onClick={() => { setEditingQuestion(null); setShowForm(true); }}
            className="flex items-center gap-2 rounded-l bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* ── Question Form ── */}
      {showForm && editingQuestion !== undefined && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-gray-800/60 p-[clamp(1rem,3vw,1.5rem)] shadow-xl backdrop-blur-sm">
          <h2 className="mb-4 text-[clamp(1rem,2vw,1.125rem)] font-semibold text-gray-100">
            {editingQuestion ? "Edit Question" : "Add New Question"}
          </h2>
          <QuestionForm
            question={editingQuestion}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingQuestion(null); }}
            loading={submitting}
          />
        </div>
      )}

      {/* ── Questions progress bar ── */}
      {questions.length > 0 && (
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <span>{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
          <span className="text-xs text-gray-600">
            {questions.filter(q => q.settings.required).length} required
          </span>
        </div>
      )}

      {/* ── Questions List ── */}
      <div className="space-y-[clamp(0.75rem,1.5vw,1rem)]">
        {questions.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-white/10 bg-gray-800/30 py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-700/50">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h3 className="mb-1 text-[clamp(1rem,2vw,1.125rem)] font-semibold text-gray-300">
                  No questions yet
                </h3>
                <p className="text-[clamp(0.875rem,1.8vw,1rem)] text-gray-500">
                  Add your first question to start building the survey
                </p>
              </div>
              <Button
                onClick={() => { setEditingQuestion(null); setShowForm(true); }}
                className="mt-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
            </div>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="group rounded-2xl border border-white/10 bg-gray-800/60 p-[clamp(1rem,3vw,1.25rem)] shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-gray-800/80"
            >
              <div className="flex items-start gap-[clamp(0.75rem,1.5vw,1rem)]">
                {/* ── Drag handle + number ── */}
                <div className="flex flex-col items-center gap-1 pt-0.5">
                  <button
                    onClick={() => moveQuestion(index, "up")}
                    disabled={index === 0}
                    className="text-gray-600 hover:text-gray-400 disabled:cursor-not-allowed disabled:opacity-20 transition-colors"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <span className="text-center text-xs font-mono text-gray-600">
                    {index + 1}
                  </span>
                </div>

                {/* ── Question Content ── */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Question title + required asterisk */}
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-[clamp(0.9375rem,1.9vw,1.0625rem)] font-semibold text-white">
                          {question.question_text}
                        </h3>
                        {question.settings.required && (
                          <span className="text-red-400 text-sm font-medium">*</span>
                        )}
                      </div>

                      {/* Description */}
                      {question.description && (
                        <p className="mb-3 text-[clamp(0.875rem,1.8vw,1rem)] text-gray-400">
                          {question.description}
                        </p>
                      )}

                      {/* Type + Required badges */}
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[clamp(0.7rem,1.4vw,0.8rem)] font-medium ${
                          questionTypeBadgeColors[question.question_type] || "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                        }`}>
                          {questionTypeLabels[question.question_type] || question.question_type}
                        </span>
                        {question.settings.required && (
                          <span className="rounded-full px-2.5 py-0.5 text-[clamp(0.7rem,1.4vw,0.8rem)] font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                            Required
                          </span>
                        )}
                      </div>

                      {/* Multiple choice / checkbox options */}
                      {(question.question_type === "multiple_choice" || question.question_type === "checkbox") &&
                        question.options.length > 0 && (
                          <div className="space-y-1.5 pl-1">
                            {question.options.map((option, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 text-[clamp(0.875rem,1.8vw,1rem)] text-gray-400"
                              >
                                <span className="h-4 w-4 flex-shrink-0 rounded border border-gray-600" />
                                {option}
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Rating scale info */}
                      {question.question_type === "rating" && (
                        <div className="text-[clamp(0.875rem,1.8vw,1rem)] text-gray-500">
                          Rating: {question.settings.min_rating} to {question.settings.max_rating}
                        </div>
                      )}
                    </div>

                    {/* ── Action buttons ── */}
                    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-gray-900/60 p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(question)}
                        className="rounded-lg text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                        title="Edit question"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <div className="mx-0.5 h-4 w-px bg-white/10" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        className="rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        title="Delete question"
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

      {/* Share Modal */}
      {survey && (
        <ShareSurveyModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          surveyId={surveyId}
          surveyTitle={survey.title}
        />
      )}
    </PageContainer>
  );
}