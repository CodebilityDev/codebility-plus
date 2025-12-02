"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import OnboardingStepper from "./OnboardingStepper";
import VideoPlayer from "./VideoPlayer";
import Quiz from "./Quiz";
import Commitment from "./Commitment";
import { getOnboardingProgress, completeOnboarding, saveQuizAndCommitment } from "../_service/action";
import { OnboardingProgressType } from "../_service/type";

interface OnboardingClientProps {
  user: any;
  applicantId: string;
  applicantData: any;
}

const VIDEO_URLS = {
  1: "https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part1.mp4", // Introduction - About Codebility
  2: "https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part2.mp4", // Benefits, Culture & Expectations
  3: "https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part3.mp4", // Roadmaps, Milestones & Tech Stack
  4: "https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part4.mp4", // Portal Tour - Gamification & Workflow
};

const VIDEO_TITLES = {
  1: "Introduction - About Codebility",
  2: "Benefits, Culture & Expectations",
  3: "Roadmaps, Milestones & Tech Stack",
  4: "Portal Tour - Gamification & Workflow",
};

const VIDEO_DESCRIPTIONS = {
  1: "Learn about Codebility, our mission, and what to expect in your journey with us.",
  2: "Discover the benefits you'll receive, our company culture, and what we expect from our developers.",
  3: "Understand our development roadmaps, project milestones, admin and mentor structure, and the tech stack we use.",
  4: "Take a tour of the Codebility portal and learn how our gamification system, points, and workflow operate.",
};

export default function OnboardingClient({
  user,
  applicantId,
  applicantData,
}: OnboardingClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<OnboardingProgressType>({
    video1: false,
    video2: false,
    video3: false,
    video4: false,
    currentVideo: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [currentStep, setCurrentStep] = useState<"videos" | "quiz" | "commitment">("videos");
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizTotal, setQuizTotal] = useState<number>(0);

  useEffect(() => {
    loadProgress();
    restoreState();
  }, []);

  const restoreState = () => {
    // Check if quiz was passed - if yes, go to commitment step
    if (applicantData.quiz_passed && !applicantData.commitment_signed_at) {
      setCurrentStep("commitment");
      setQuizScore(applicantData.quiz_score || 0);
      setQuizTotal(applicantData.quiz_total || 0);
    }
    // Check if all videos are complete but quiz not started
    else if (applicantData.quiz_completed_at) {
      setCurrentStep("quiz");
    }
  };

  const loadProgress = async () => {
    setIsLoading(true);
    const result = await getOnboardingProgress(applicantId);
    if (result?.progress) {
      setProgress(result.progress);
    }
    setIsLoading(false);
  };

  const handleVideoComplete = async () => {
    await loadProgress();
  };

  const handleNextVideo = () => {
    if (progress.currentVideo < 4) {
      setProgress((prev) => ({
        ...prev,
        currentVideo: prev.currentVideo + 1,
      }));
    }
  };

  const handlePreviousVideo = () => {
    if (progress.currentVideo > 1) {
      setProgress((prev) => ({
        ...prev,
        currentVideo: prev.currentVideo - 1,
      }));
    }
  };

  const handleProceedToQuiz = () => {
    setCurrentStep("quiz");
  };

  const handleBackToVideos = () => {
    setCurrentStep("videos");
  };

  const handleBackToQuiz = () => {
    setCurrentStep("quiz");
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= 4) {
      // Navigate to video step
      setCurrentStep("videos");
      setProgress((prev) => ({
        ...prev,
        currentVideo: stepNumber as 1 | 2 | 3 | 4,
      }));
    } else if (stepNumber === 5) {
      // Navigate to quiz/commitment based on quiz status
      if (applicantData.quiz_passed && !applicantData.commitment_signed_at) {
        setCurrentStep("commitment");
      } else {
        setCurrentStep("quiz");
      }
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    setQuizScore(score);
    setQuizTotal(total);
    setCurrentStep("commitment");
  };

  const handleCommitmentComplete = async (signature: string, canDoMobile: boolean) => {
    setIsCompleting(true);

    // Save quiz results, signature, and mobile capability
    await saveQuizAndCommitment({
      applicantId,
      quizScore,
      quizTotal,
      signature,
      canDoMobile,
    });

    // Change status from onboarding to waitlist
    const result = await completeOnboarding(user.id, "waitlist");
    if (result.success) {
      router.push("/applicant/waiting");
    } else {
      alert("Failed to complete onboarding. Please try again.");
      setIsCompleting(false);
    }
  };

  const canWatchVideo = (videoNumber: number): boolean => {
    // Always allow watching video 1
    if (videoNumber === 1) return true;

    // For other videos, allow if:
    // 1. Previous video is completed (sequential unlock), OR
    // 2. This video has already been completed (allow rewatching)
    if (videoNumber === 2) return progress.video1 || progress.video2;
    if (videoNumber === 3) return progress.video2 || progress.video3;
    if (videoNumber === 4) return progress.video3 || progress.video4;
    return false;
  };

  const isVideoCompleted = (videoNumber: number): boolean => {
    if (videoNumber === 1) return progress.video1;
    if (videoNumber === 2) return progress.video2;
    if (videoNumber === 3) return progress.video3;
    if (videoNumber === 4) return progress.video4;
    return false;
  };

  const allVideosComplete = progress.video1 && progress.video2 && progress.video3 && progress.video4;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold lg:text-4xl">
            Welcome to Codebility Onboarding
          </h1>
          <p className="text-gray-400">
            {currentStep === "videos" && "Complete all 4 videos, then take the quiz"}
            {currentStep === "quiz" && "Test your understanding of the onboarding videos"}
            {currentStep === "commitment" && "Review and sign your commitment to join Codebility"}
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <OnboardingStepper
            progress={progress}
            currentVideo={currentStep === "videos" ? progress.currentVideo : 5}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Content Section */}
        <div className="rounded-xl bg-black-100 border border-gray-800 p-6 shadow-lg lg:p-8">
          {currentStep === "videos" && (
            <>
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Video {progress.currentVideo}: {VIDEO_TITLES[progress.currentVideo as keyof typeof VIDEO_TITLES]}
            </h2>
            <p className="text-gray-400">
              {VIDEO_DESCRIPTIONS[progress.currentVideo as keyof typeof VIDEO_DESCRIPTIONS]}
            </p>
          </div>

          <VideoPlayer
            videoNumber={progress.currentVideo}
            videoUrl={VIDEO_URLS[progress.currentVideo as keyof typeof VIDEO_URLS]}
            applicantId={applicantId}
            onVideoComplete={handleVideoComplete}
            canWatch={canWatchVideo(progress.currentVideo)}
          />

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              onClick={handlePreviousVideo}
              disabled={progress.currentVideo === 1}
              variant="outline"
              className="w-24"
            >
              Previous
            </Button>

            <div className="flex gap-4">
              <Button
                onClick={progress.currentVideo === 4 ? handleProceedToQuiz : handleNextVideo}
                disabled={!isVideoCompleted(progress.currentVideo)}
                className="from-customTeal to-customViolet-100 w-24 bg-gradient-to-r via-customBlue-100"
              >
                {progress.currentVideo === 4 ? 'Proceed to Quiz' : 'Next'}
              </Button>
            </div>
          </div>
            </>
          )}

          {currentStep === "quiz" && (
            <Quiz
              applicantId={applicantId}
              onQuizComplete={handleQuizComplete}
              onBackToVideos={handleBackToVideos}
            />
          )}

          {currentStep === "commitment" && (
            <>
              <Commitment
                userName={`${user.first_name} ${user.last_name}`}
                onComplete={handleCommitmentComplete}
              />

              {/* Back to Quiz Button */}
              <div className="mt-6">
                <Button
                  onClick={handleBackToQuiz}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  ← Back to Quiz
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Progress Summary - Only show during videos step */}
        {currentStep === "videos" && (
          <div className="mt-8 rounded-lg bg-black-100 border border-gray-800 p-6 shadow">
            <h3 className="mb-4 text-lg font-semibold">
              Your Progress
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`rounded-lg border-2 p-4 text-center ${
                    isVideoCompleted(num)
                      ? "border-green-500 bg-green-900/20"
                      : "border-gray-700 bg-gray-900/20"
                  }`}
                >
                  <div className="text-2xl font-bold">
                    {isVideoCompleted(num) ? "✓" : num}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-400">
                    {isVideoCompleted(num) ? "Completed" : "Pending"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
