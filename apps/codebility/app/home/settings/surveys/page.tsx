"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { H1 } from "@/components/shared/dashboard";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Eye, EyeOff, Pencil, Plus, Settings, Trash2, Share2, BarChart2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@codevs/ui/button";

import PageContainer from "../../_components/PageContainer";
import SurveyForm from "./_components/SurveyForm";
import ShareSurveyModal from "./_components/ShareSurveyModal";

interface Survey {
  id: string;
  title: string;
  description: string;
  type: "general" | "feedback" | "satisfaction" | "research" | "onboarding";
  image_url?: string;
  target_audience: "all" | "codev" | "intern" | "hr" | "admin";
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

// Badge color map using transparent fills (dark mode friendly)
const typeColors: Record<string, string> = {
  general: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  feedback: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  satisfaction: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  research: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
  onboarding: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
};

// Left accent border per survey type - gives each card a colored identity stripe
const typeAccent: Record<string, string> = {
  general: "border-l-blue-500",
  feedback: "border-l-emerald-500",
  satisfaction: "border-l-amber-500",
  research: "border-l-violet-500",
  onboarding: "border-l-pink-500",
};

const audienceColors: Record<string, string> = {
  all: "bg-gray-500/15 text-gray-400 border border-gray-500/30",
  codev: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
  intern: "bg-teal-500/15 text-teal-400 border border-teal-500/30",
  hr: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  admin: "bg-red-500/15 text-red-400 border border-red-500/30",
};

// Handles its own imgError state — shows uploaded image when valid,
// falls back to Codebility logo when image_url is absent or broken
function SurveyThumbnail({
  imageUrl,
  title,
}: {
  imageUrl?: string;
  title: string;
}) {
  const [imgError, setImgError] = useState(false);

  const showFallback = !imageUrl || imgError;

  return (
    // h-16 w-16 both explicit — aspect-square conflicts with flex row stretching
    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gray-900 flex items-center justify-center">
      <img
        src={showFallback ? "/assets/svgs/codebility-white.svg" : imageUrl!}
        alt={title}
        className={showFallback
          ? "h-9 w-9 object-contain opacity-50"
          : "h-full w-full object-cover"    // cover crops to center — best for thumbnails
        }
        onError={() => {
            // Only log + set error when trying to load the actual image, not the fallback
            if (!imgError) {
              console.error("[SurveyThumbnail] Failed to load image_url:", imageUrl);
              setImgError(true);
            }
          }}
      />
    </div>
  );
}

export default function SurveysPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    const supabase = createClientClientComponent();
    if (!supabase) {
      toast.error("Failed to initialize database connection");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching surveys:", error);
      toast.error("Failed to fetch surveys");
    } else {
      setSurveys(data || []);
    }
    setLoading(false);
  };

  const toggleSurveyStatus = async (survey: Survey) => {
    const supabase = createClientClientComponent();
    if (!supabase) { toast.error("Failed to initialize database connection"); return; }
    const { error } = await supabase
      .from("surveys")
      .update({ is_active: !survey.is_active, updated_at: new Date().toISOString() })
      .eq("id", survey.id);
    if (error) {
      toast.error("Failed to update survey status");
    } else {
      toast.success(`Survey ${!survey.is_active ? "activated" : "deactivated"}`);
      fetchSurveys();
    }
  };

  const deleteSurvey = async (surveyId: string) => {
    if (!confirm("Are you sure you want to delete this survey?")) return;
    const supabase = createClientClientComponent();
    if (!supabase) { toast.error("Failed to initialize database connection"); return; }
    const { error } = await supabase.from("surveys").delete().eq("id", surveyId);
    if (error) {
      toast.error("Failed to delete survey");
    } else {
      toast.success("Survey deleted successfully");
      fetchSurveys();
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSurvey(null);
    fetchSurveys();
  };

  const handleShare = (survey: Survey) => {
    setSelectedSurvey(survey);
    setShareModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      {/* ── Page Header ── */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <BarChart2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <H1 className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Surveys
            </H1>
            <p className="text-[clamp(0.875rem,1.8vw,1rem)] text-gray-400">
              Manage surveys and collect feedback from users
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 text-white shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add Survey
        </Button>
      </div>

      {/* ── Create / Edit Form ── */}
      {(showForm || editingSurvey) && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-gray-800/60 p-[clamp(1rem,3vw,1.5rem)] shadow-xl backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-600">
                <span className="text-sm text-white">{editingSurvey ? "✏️" : "➕"}</span>
              </div>
              <h2 className="text-[clamp(1rem,2vw,1.125rem)] font-semibold text-gray-100">
                {editingSurvey ? "Edit Survey" : "Create New Survey"}
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => { setShowForm(false); setEditingSurvey(null); }}
              className="rounded-lg text-gray-400 hover:bg-white/10 hover:text-gray-200"
            >
              Cancel
            </Button>
          </div>
          <SurveyForm survey={editingSurvey} onSuccess={handleFormSuccess} />
        </div>
      )}

      {/* ── Quick Stats Row ── */}
      {surveys.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="rounded-xl border border-white/10 bg-gray-800/40 px-4 py-2 text-sm text-gray-400">
            <span className="font-semibold text-white">{surveys.length}</span> total
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            <span className="font-semibold">{surveys.filter((s) => s.is_active).length}</span> active
          </div>
          <div className="rounded-xl border border-gray-500/20 bg-gray-500/10 px-4 py-2 text-sm text-gray-400">
            <span className="font-semibold">{surveys.filter((s) => !s.is_active).length}</span> inactive
          </div>
        </div>
      )}

      {/* ── Survey Cards ── */}
      <div className="space-y-[clamp(0.75rem,1.5vw,1rem)]">
        {surveys.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-white/10 bg-gray-800/30 py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-700/50">
                <BarChart2 className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h3 className="mb-1 text-[clamp(1rem,2vw,1.125rem)] font-semibold text-gray-300">
                  No surveys yet
                </h3>
                <p className="text-[clamp(0.875rem,1.8vw,1rem)] text-gray-500">
                  Create your first survey to start collecting feedback
                </p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white"
              >
                <Plus className="h-4 w-4" />
                Create Survey
              </Button>
            </div>
          </div>
        ) : (
          surveys.map((survey) => (
            <div
              key={survey.id}
              // Left colored stripe identifies the survey type at a glance
              className={`group rounded-2xl border border-white/10 border-l-4 ${
                typeAccent[survey.type] || "border-l-violet-500"
              } bg-gray-800/60 p-[clamp(1rem,3vw,1.25rem)] shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-gray-800/80 hover:shadow-lg hover:shadow-black/20`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* ── Left: Thumbnail + Content ── */}
                <div className="flex flex-1 gap-[clamp(0.75rem,1.5vw,1rem)]">
                  <SurveyThumbnail
                    imageUrl={survey.image_url}
                    title={survey.title}
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    {/* Title + Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[clamp(1rem,2vw,1.125rem)] font-semibold text-white">
                        {survey.title}
                      </h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[clamp(0.7rem,1.4vw,0.8rem)] font-medium capitalize ${typeColors[survey.type]}`}>
                        {survey.type}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[clamp(0.7rem,1.4vw,0.8rem)] font-medium ${audienceColors[survey.target_audience]}`}>
                        {survey.target_audience}
                      </span>
                      {/* Status badge with dot indicator */}
                      <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[clamp(0.7rem,1.4vw,0.8rem)] font-medium ${
                        survey.is_active
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${survey.is_active ? "bg-emerald-400" : "bg-gray-500"}`} />
                        {survey.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Description — clamp to 2 lines */}
                    <p className="text-[clamp(0.875rem,1.8vw,1rem)] leading-relaxed text-gray-400 line-clamp-2">
                      {survey.description}
                    </p>

                    {/* Meta: dates + priority */}
                    <div className="flex flex-wrap items-center gap-3 text-[clamp(0.7rem,1.4vw,0.8rem)] text-gray-500">
                      <span>Created {formatDate(survey.start_date)}</span>
                      {survey.end_date && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-600" />
                          <span>Expires {formatDate(survey.end_date)}</span>
                        </>
                      )}
                      <span className="h-1 w-1 rounded-full bg-gray-600" />
                      <span>Priority {survey.priority}</span>
                    </div>
                  </div>
                </div>

                {/* ── Right: Action button group ── */}
                <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-gray-900/60 p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(survey)}
                    className="rounded-lg text-violet-400 hover:bg-violet-500/20 hover:text-violet-300"
                    title="Share survey"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/home/settings/surveys/${survey.id}`)}
                    className="rounded-lg text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                    title="Build questions"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSurveyStatus(survey)}
                    title={survey.is_active ? "Deactivate" : "Activate"}
                    className={`rounded-lg ${
                      survey.is_active
                        ? "text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                        : "text-gray-500 hover:bg-gray-500/20 hover:text-gray-300"
                    }`}
                  >
                    {survey.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSurvey(survey)}
                    className="rounded-lg text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                    title="Edit survey"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {/* Visual separator before destructive action */}
                  <div className="mx-1 h-5 w-px bg-white/10" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSurvey(survey.id)}
                    className="rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    title="Delete survey"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Share Modal */}
      {selectedSurvey && (
        <ShareSurveyModal
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedSurvey(null);
          }}
          surveyId={selectedSurvey.id}
          surveyTitle={selectedSurvey.title}
        />
      )}
    </PageContainer>
  );
}