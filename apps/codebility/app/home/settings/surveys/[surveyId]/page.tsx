import { Suspense } from "react";
import { getSurveyQuestions } from "@/actions/settings/survey-questions";
import { getSurveyById } from "@/actions/settings/surveys";

import PageContainer from "../../../_components/PageContainer";
import SurveyBuilder from "./_components/SurveyBuilder";
import Loading from "./loading";

interface PageProps {
  params: Promise<{ surveyId: string }>;
}

async function SurveyBuilderData({ surveyId }: { surveyId: string }) {
  const [surveyResult, questionsResult] = await Promise.all([
    getSurveyById(surveyId),
    getSurveyQuestions(surveyId),
  ]);

  const surveyRow = surveyResult.data;

  if (surveyResult.error || !surveyRow) {
    console.error("Error fetching survey:", surveyResult.error);
    return (
      <PageContainer maxWidth="2xl">
        <div className="flex h-64 items-center justify-center text-gray-400">
          Failed to fetch survey
        </div>
      </PageContainer>
    );
  }

  if (questionsResult.error) {
    console.error("Error fetching survey questions:", questionsResult.error);
  }

  return (
    <SurveyBuilder
      surveyId={surveyId}
      survey={{
        id: surveyRow.id,
        title: surveyRow.title,
        description: surveyRow.description,
        type: surveyRow.type,
        image_url: surveyRow.image_url ?? undefined,
      }}
      initialQuestions={questionsResult.data ?? []}
    />
  );
}

export default async function SurveyBuilderPage({ params }: PageProps) {
  const { surveyId } = await params;

  return (
    <Suspense fallback={<Loading />}>
      <SurveyBuilderData surveyId={surveyId} />
    </Suspense>
  );
}
