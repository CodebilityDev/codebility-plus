import { Suspense } from "react";
import Link from "next/link";
import { H1 } from "@/components/shared/dashboard";
import { ArrowLeft, CheckCircle, Users } from "lucide-react";

import { Button } from "@codevs/ui/button";

import PageContainer from "../../../../_components/PageContainer";
import { getSurveyQuestions } from "@/actions/settings/survey-questions";
import {
  getSurveyResponses,
  getSurveyStatistics,
} from "@/actions/settings/survey-responses";
import { getSurveyById } from "@/actions/settings/surveys";
import ExportResultsButton from "./_components/ExportResultsButton";
import type { Question, Statistics, SurveyResponse } from "./_components/types";

function ResultsSkeleton() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-violet-500"></div>
    </div>
  );
}

function getAnswerSummary(question: Question, responses: SurveyResponse[]) {
  const questionResponses = responses
    .map((r) => r.answers[question.id])
    .filter(Boolean);

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
          counts[String(item)] = (counts[String(item)] || 0) + 1;
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
}

async function SurveyResultsData({ surveyId }: { surveyId: string }) {
  const [surveyResult, questionsResult, responsesResult, statsResult] =
    await Promise.all([
      getSurveyById(surveyId),
      getSurveyQuestions(surveyId),
      getSurveyResponses(surveyId),
      getSurveyStatistics(surveyId),
    ]);

  const survey = surveyResult.data ?? null;
  const questions: Question[] = questionsResult.data ?? [];
  const responses: SurveyResponse[] = responsesResult.data ?? [];
  const statistics = (statsResult.data ?? null) as Statistics | null;

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <H1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {survey?.title} - Results
          </H1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Survey responses and analytics
          </p>
        </div>
        <ExportResultsButton
          surveyId={surveyId}
          questions={questions}
          responses={responses}
        />
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Responses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statistics?.total_responses || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unique Respondents
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statistics?.unique_respondents || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statistics?.total_responses
                  ? Math.round(
                      ((statistics.completed_responses || 0) /
                        statistics.total_responses) *
                        100,
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
          const summary = getAnswerSummary(question, responses);

          return (
            <div
              key={question.id}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {index + 1}. {question.question_text}
              </h3>

              {/* Multiple Choice / Checkbox Results */}
              {(question.question_type === "multiple_choice" ||
                question.question_type === "checkbox") && (
                <div className="space-y-3">
                  {Object.entries(summary as Record<string, number>)
                    .sort(([, a], [, b]) => b - a)
                    .map(([option, count]) => {
                      const percentage = (
                        (count / responses.length) *
                        100
                      ).toFixed(1);
                      return (
                        <div key={option}>
                          <div className="mb-1 flex justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {option}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
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
                <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-900/50">
                  <p className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
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
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {(summary as string[]).map((answer, i) => (
                    <div
                      key={i}
                      className="rounded bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
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
    </>
  );
}

export default async function SurveyResultsPage({
  params,
}: {
  params: Promise<{ surveyId: string }>;
}) {
  const { surveyId } = await params;

  return (
    <PageContainer maxWidth="7xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          asChild
          variant="ghost"
          className="text-gray-600 dark:text-gray-400"
        >
          <Link href={`/home/settings/surveys/${surveyId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ResultsSkeleton />}>
        <SurveyResultsData surveyId={surveyId} />
      </Suspense>
    </PageContainer>
  );
}
