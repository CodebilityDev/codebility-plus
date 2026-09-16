"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

import { useModal } from "@/hooks/modals/use-modal";
import { Button } from "@codevs/ui/button";
import {
  getPendingSurveyForUser,
  getDismissedSurveys,
  undismissSurvey,
} from "@/actions/settings/surveys";
import { getSurveyQuestions } from "@/actions/settings/survey-questions";

interface Survey {
  id: string;
  title: string;
  description: string;
  type: string;
}

const surveysKey = ["surveys", "widget"] as const;

export default function SurveyWidget() {
  const { onOpen } = useModal();
  const queryClient = useQueryClient();
  const [showDismissed, setShowDismissed] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: surveysKey,
    queryFn: async () => {
      const [pending, dismissed] = await Promise.all([
        getPendingSurveyForUser(),
        getDismissedSurveys(),
      ]);
      return {
        pending: pending.data ?? null,
        dismissed: (dismissed.data ?? []) as Survey[],
      };
    },
  });

  // The modal reads its content from the store, so opening it is imperative and
  // this cannot be expressed as render output. One-shot guard keeps a background
  // refetch from re-opening a survey the user already dismissed.
  const pendingSurvey = data?.pending ?? null;
  const autoOpened = useRef(false);
  useEffect(() => {
    if (!pendingSurvey || autoOpened.current) return;
    autoOpened.current = true;
    onOpen("surveyModal", pendingSurvey);
  }, [pendingSurvey, onOpen]);

  const reopen = useMutation({
    mutationFn: async (survey: Survey) => {
      const result = await undismissSurvey(survey.id);
      if (!result.success) throw new Error("Could not reopen survey");
      const questions = await getSurveyQuestions(survey.id);
      return { ...survey, questions: questions.data ?? [] };
    },
    onSuccess: (surveyWithQuestions) => {
      onOpen("surveyModal", surveyWithQuestions);
      queryClient.setQueryData(surveysKey, (prev: typeof data) =>
        prev
          ? {
              ...prev,
              dismissed: prev.dismissed.filter((s) => s.id !== surveyWithQuestions.id),
            }
          : prev,
      );
    },
  });

  const dismissedSurveys = data?.dismissed ?? [];

  if (isLoading || dismissedSurveys.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => setShowDismissed(!showDismissed)}
          className="flex w-full items-center gap-2 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Pending Surveys
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {dismissedSurveys.length} survey
              {dismissedSurveys.length !== 1 ? "s" : ""} waiting
            </p>
          </div>
          {showDismissed ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {showDismissed && (
          <div className="max-h-64 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
            {dismissedSurveys.map((survey) => (
              <div
                key={survey.id}
                className="border-b border-gray-100 p-4 last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {survey.title}
                    </p>
                    <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                      {survey.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={reopen.isPending}
                    onClick={() => reopen.mutate(survey)}
                    className="flex-shrink-0 bg-gradient-to-r from-violet-500 to-purple-500 text-xs text-white hover:from-violet-600 hover:to-purple-600"
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
