"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Users, CheckCircle } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { H1 } from "@/components/shared/dashboard";
import PageContainer from "../../../../_components/PageContainer";
import { createClientClientComponent } from "@/utils/supabase/client";
import { toast } from "sonner";
import { getSurveyQuestions } from "../../../questions/actions";
import { getSurveyResponses, getSurveyStatistics } from "../../../responses/actions";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
}

interface Response {
  id: string;
  answers: Record<string, any>;
  submitted_at: string;
  respondent: {
    first_name: string;
    last_name: string;
    email_address: string;
  } | null;
  respondent_email: string | null;
}

interface Statistics {
  total_responses: number;
  completed_responses: number;
  unique_respondents: number;
  last_response_at: string;
}

export default function SurveyResultsPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [surveyId]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch survey
    const supabase = createClientClientComponent();
    const { data: surveyData } = await supabase
      .from("surveys")
      .select("id, title, description")
      .eq("id", surveyId)
      .single();

    setSurvey(surveyData);

    // Fetch questions
    const questionsResult = await getSurveyQuestions(surveyId);
    if (questionsResult.data) {
      setQuestions(questionsResult.data);
    }

    // Fetch responses
    const responsesResult = await getSurveyResponses(surveyId);
    if (responsesResult.data) {
      setResponses(responsesResult.data);
    }

    // Fetch statistics
    const statsResult = await getSurveyStatistics(surveyId);
    if (statsResult.data) {
      setStatistics(statsResult.data);
    }

    setLoading(false);
  };

  const getAnswerSummary = (question: Question) => {
    const questionResponses = responses.map((r) => r.answers[question.id]).filter(Boolean);

    if (question.question_type === "multiple_choice") {
      const counts: Record<string, number> = {};
      questionResponses.forEach((answer) => {
        counts[answer] = (counts[answer] || 0) + 1;
      });
      return counts;
    }

    if (question.question_type === "checkbox") {
      const counts: Record<string, number> = {};
      questionResponses.forEach((answer) => {
        if (Array.isArray(answer)) {
          answer.forEach((item) => {
            counts[item] = (counts[item] || 0) + 1;
          });
        }
      });
      return counts;
    }

    if (question.question_type === "rating") {
      const ratings = questionResponses as number[];
      const average = ratings.length
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : "N/A";
      return { average, count: ratings.length };
    }

    return questionResponses;
  };

  const exportToCSV = () => {
    if (responses.length === 0) {
      toast.error("No responses to export");
      return;
    }

    const headers = [
      "Submitted At",
      "Respondent",
      ...questions.map((q) => q.question_text),
    ];

    const rows = responses.map((response) => {
      const respondentName = response.respondent
        ? `${response.respondent.first_name} ${response.respondent.last_name}`
        : response.respondent_email || "Anonymous";

      return [
        new Date(response.submitted_at).toLocaleString(),
        respondentName,
        ...questions.map((q) => {
          const answer = response.answers[q.id];
          if (Array.isArray(answer)) return answer.join(", ");
          return answer || "";
        }),
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `survey-${surveyId}-results.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported successfully");
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

  return (
    <PageContainer maxWidth="6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/home/settings/surveys/${surveyId}`)}
          className="text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Builder
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <H1 className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            {survey?.title} - Results
          </H1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Survey responses and analytics
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          disabled={responses.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Responses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statistics?.total_responses || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unique Respondents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statistics?.unique_respondents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statistics?.total_responses
                  ? Math.round(
                      ((statistics.completed_responses || 0) / statistics.total_responses) * 100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Results */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const summary = getAnswerSummary(question);

          return (
            <div
              key={question.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {index + 1}. {question.question_text}
              </h3>

              {/* Multiple Choice / Checkbox Results */}
              {(question.question_type === "multiple_choice" ||
                question.question_type === "checkbox") && (
                <div className="space-y-3">
                  {Object.entries(summary as Record<string, number>)
                    .sort(([, a], [, b]) => b - a)
                    .map(([option, count]) => {
                      const percentage =
                        ((count / responses.length) * 100).toFixed(1);
                      return (
                        <div key={option}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {option}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Rating Results */}
              {question.question_type === "rating" && (
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {(summary as any).average}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Average rating from {(summary as any).count} responses
                  </p>
                </div>
              )}

              {/* Text Responses */}
              {(question.question_type === "text" ||
                question.question_type === "textarea" ||
                question.question_type === "email") && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(summary as string[]).map((answer, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded text-sm text-gray-700 dark:text-gray-300"
                    >
                      {answer}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
