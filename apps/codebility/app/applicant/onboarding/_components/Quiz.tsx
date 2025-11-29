"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { quizQuestions, QuizQuestion } from "./quizData";
import { saveQuizProgress } from "../_service/action";

interface QuizProps {
  applicantId: string;
  onQuizComplete: (score: number, totalQuestions: number) => void;
  onBackToVideos?: () => void;
}

export default function Quiz({ applicantId, onQuizComplete, onBackToVideos }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const hasSelectedAnswer = selectedAnswers[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Calculate score
      let correctCount = 0;
      quizQuestions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      const finalScore = correctCount;
      const passed = (finalScore / quizQuestions.length) * 100 >= 70;

      setScore(finalScore);
      setShowResults(true);

      // Save quiz progress to database
      setIsSaving(true);
      await saveQuizProgress({
        applicantId,
        quizScore: finalScore,
        quizTotal: quizQuestions.length,
        passed,
      });
      setIsSaving(false);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleComplete = () => {
    onQuizComplete(score, quizQuestions.length);
  };

  if (showResults) {
    const percentage = (score / quizQuestions.length) * 100;
    const passed = percentage >= 70; // 70% passing grade

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold">Quiz Results</h2>
          <div
            className={`mx-auto mb-6 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 ${
              passed ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20"
            }`}
          >
            <span className={`text-4xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
          <p className="mb-2 text-xl">
            You got <span className="font-bold">{score}</span> out of{" "}
            <span className="font-bold">{quizQuestions.length}</span> correct
          </p>
          {passed ? (
            <p className="text-green-400">Great job! You passed the quiz.</p>
          ) : (
            <p className="text-red-400">
              You need at least 70% to pass. Please review the videos and try again.
            </p>
          )}
        </div>

        {/* Answer Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Review Your Answers</h3>
          {quizQuestions.map((question, index) => {
            const userAnswer = selectedAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`rounded-lg border p-4 ${
                  isCorrect ? "border-green-500 bg-green-900/10" : "border-red-500 bg-red-900/10"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <p className="font-medium">
                    {index + 1}. {question.question}
                  </p>
                  {isCorrect ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-red-400">✗</span>
                  )}
                </div>
                <p className="mb-1 text-sm text-gray-400">
                  Your answer: <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                    {question.options[userAnswer]}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="mb-1 text-sm text-gray-400">
                    Correct answer: <span className="text-green-400">
                      {question.options[question.correctAnswer]}
                    </span>
                  </p>
                )}
                {question.explanation && (
                  <p className="mt-2 text-sm text-gray-500">{question.explanation}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            {!passed && (
              <Button onClick={handleRetake} variant="outline" className="px-8">
                Retake Quiz
              </Button>
            )}
            {passed && (
              <Button
                onClick={handleComplete}
                className="from-customTeal to-customViolet-100 bg-gradient-to-r via-customBlue-100 px-8"
              >
                Continue to Commitment
              </Button>
            )}
          </div>

          {/* Back to Videos Button */}
          {onBackToVideos && (
            <div className="flex justify-center">
              <Button
                onClick={onBackToVideos}
                variant="outline"
                className="w-full sm:w-auto"
              >
                ← Back to Videos
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
          <span>
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </span>
          <span>{Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-customTeal via-customBlue-100 to-customViolet-100 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="mb-6 text-xl font-semibold">{currentQuestion.question}</h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                selectedAnswers[currentQuestion.id] === index
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-gray-700 bg-gray-900/20 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-600"
                  }`}
                >
                  {selectedAnswers[currentQuestion.id] === index && (
                    <div className="h-3 w-3 rounded-full bg-white"></div>
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="w-24"
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!hasSelectedAnswer}
          className="from-customTeal to-customViolet-100 w-24 bg-gradient-to-r via-customBlue-100"
        >
          {isLastQuestion ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}
