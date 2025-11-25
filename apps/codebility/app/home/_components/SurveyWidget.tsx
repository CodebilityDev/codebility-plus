"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@codevs/ui/button";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import {
  getPendingSurveyForUser,
  getDismissedSurveys,
  undismissSurvey,
} from "../settings/surveys/actions";
import { getSurveyQuestions } from "../settings/surveys/questions/actions";

interface Survey {
  id: string;
  title: string;
  description: string;
  type: string;
}

export default function SurveyWidget() {
  const { onOpen } = useModal();
  const [pendingSurvey, setPendingSurvey] = useState<any>(null);
  const [dismissedSurveys, setDismissedSurveys] = useState<Survey[]>([]);
  const [showDismissed, setShowDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);

    try {
      // Check for pending survey
      const pendingResult = await getPendingSurveyForUser();

      if (pendingResult.data) {
        setPendingSurvey(pendingResult.data);
        // Auto-open modal for pending survey
        onOpen("surveyModal", pendingResult.data);
      }

      // Get dismissed surveys
      const dismissedResult = await getDismissedSurveys();

      if (dismissedResult.data) {
        setDismissedSurveys(dismissedResult.data);
      }
    } catch (error) {
      // Error fetching surveys
    }

    setLoading(false);
  };

  const handleReopenSurvey = async (survey: Survey) => {
    const result = await undismissSurvey(survey.id);
    if (result.success) {
      // Get questions for the survey
      const questionsResult = await getSurveyQuestions(survey.id);
      if (questionsResult.data) {
        const surveyWithQuestions = {
          ...survey,
          questions: questionsResult.data,
        };
        onOpen("surveyModal", surveyWithQuestions);
        // Remove from dismissed list
        setDismissedSurveys((prev) => prev.filter((s) => s.id !== survey.id));
      }
    }
  };

  // Don't show widget UI if no dismissed surveys, but component still needs to run to auto-open modal
  if (loading || dismissedSurveys.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowDismissed(!showDismissed)}
          className="flex items-center gap-2 p-4 w-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Pending Surveys
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {dismissedSurveys.length} survey{dismissedSurveys.length !== 1 ? "s" : ""} waiting
            </p>
          </div>
          {showDismissed ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {showDismissed && (
          <div className="border-t border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
            {dismissedSurveys.map((survey) => (
              <div
                key={survey.id}
                className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {survey.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {survey.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleReopenSurvey(survey)}
                    className="flex-shrink-0 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white text-xs"
                  >
                    Take Survey
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
