import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSurveyQuestions } from "@/actions/settings/survey-questions";
import { hasUserResponded } from "@/actions/settings/survey-responses";
import { getSurveyById } from "@/actions/settings/surveys";

import SurveyResponseForm from "./_components/SurveyResponseForm";
import Loading from "./loading";

interface SurveyResponsePageProps {
  params: Promise<{ surveyId: string }>;
}

async function SurveyData({ surveyId }: { surveyId: string }) {
  const [surveyResult, responseCheck, questionsResult] = await Promise.all([
    getSurveyById(surveyId),
    hasUserResponded(surveyId),
    getSurveyQuestions(surveyId),
  ]);

  if (surveyResult.error || !surveyResult.data) {
    redirect("/home");
  }

  const { id, title, description, is_active } = surveyResult.data;

  return (
    <SurveyResponseForm
      surveyId={surveyId}
      survey={{ id, title, description, is_active }}
      questions={questionsResult.data || []}
      questionsError={questionsResult.error}
      alreadyResponded={responseCheck.hasResponded === true}
    />
  );
}

export default async function SurveyResponsePage({
  params,
}: SurveyResponsePageProps) {
  const { surveyId } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <SurveyData surveyId={surveyId} />
    </Suspense>
  );
}
