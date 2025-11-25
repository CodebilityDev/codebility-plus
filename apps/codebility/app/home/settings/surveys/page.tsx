"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Settings } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { H1 } from "@/components/shared/dashboard";
import PageContainer from "../../_components/PageContainer";
import SurveyForm from "./_components/SurveyForm";
import { createClientClientComponent } from "@/utils/supabase/client";
import { toast } from "sonner";

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

const typeColors = {
  general: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  feedback: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  satisfaction: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  research: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
  onboarding: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200",
};

const audienceColors = {
  all: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200",
  codev: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200",
  intern: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200",
  hr: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
  admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
};

export default function SurveysPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    const supabase = createClientClientComponent();

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

    const { error } = await supabase
      .from("surveys")
      .delete()
      .eq("id", surveyId);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <PageContainer maxWidth="6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <H1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Surveys
            </H1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage surveys and collect feedback from users
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
        >
          <Plus className="h-4 w-4" />
          Add Survey
        </Button>
      </div>

      {(showForm || editingSurvey) && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm">
                  {editingSurvey ? "✏️" : "➕"}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingSurvey ? "Edit Survey" : "Create New Survey"}
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setEditingSurvey(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
          </div>
          <SurveyForm
            survey={editingSurvey}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      <div className="space-y-4">
        {surveys.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No surveys yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create your first survey to start collecting feedback from users
                </p>
              </div>
            </div>
          </div>
        ) : (
          surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* Survey Image Preview */}
                  {survey.image_url && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img
                        src={survey.image_url}
                        alt={survey.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">{survey.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          typeColors[survey.type]
                        }`}
                      >
                        {survey.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          audienceColors[survey.target_audience]
                        }`}
                      >
                        {survey.target_audience}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          survey.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200"
                        }`}
                      >
                        {survey.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        Priority: {survey.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {survey.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div>Created: {formatDate(survey.start_date)}</div>
                      {survey.end_date && (
                        <div>Expires: {formatDate(survey.end_date)}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/home/settings/surveys/${survey.id}`)}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    title="Build questions"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSurveyStatus(survey)}
                    title={survey.is_active ? "Deactivate" : "Activate"}
                    className={`${
                      survey.is_active
                        ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {survey.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSurvey(survey)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Edit survey"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSurvey(survey.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
    </PageContainer>
  );
}
