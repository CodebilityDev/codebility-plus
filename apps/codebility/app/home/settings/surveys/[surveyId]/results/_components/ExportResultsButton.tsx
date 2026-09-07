"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@codevs/ui/button";

import type { Question, SurveyResponse } from "./types";

interface ExportResultsButtonProps {
  surveyId: string;
  questions: Question[];
  responses: SurveyResponse[];
}

export default function ExportResultsButton({
  surveyId,
  questions,
  responses,
}: ExportResultsButtonProps) {
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

  return (
    <Button
      onClick={exportToCSV}
      disabled={responses.length === 0}
      className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
