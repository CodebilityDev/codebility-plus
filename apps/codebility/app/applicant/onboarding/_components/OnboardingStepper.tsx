"use client";

import React from "react";
import { OnboardingProgressType } from "../_service/type";

interface OnboardingStepperProps {
  progress: OnboardingProgressType;
  currentVideo: number;
  onStepClick?: (step: number) => void;
}

export default function OnboardingStepper({
  progress,
  currentVideo,
  onStepClick,
}: OnboardingStepperProps) {
  const steps = [
    { number: 1, title: "Introduction", completed: progress.video1 },
    { number: 2, title: "Benefits & Culture", completed: progress.video2 },
    { number: 3, title: "Roadmaps & Tech", completed: progress.video3 },
    { number: 4, title: "Portal Tour", completed: progress.video4 },
    { number: 5, title: "Quiz & Commitment", completed: false }, // Will be updated based on quiz/commitment status
  ];

  const handleStepClick = (stepNumber: number) => {
    if (onStepClick) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => handleStepClick(step.number)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${
                  step.completed
                    ? "border-green-500 bg-green-500 text-white hover:bg-green-600"
                    : currentVideo === step.number
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600"
                }`}
              >
                {step.completed ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  step.completed || currentVideo === step.number
                    ? "text-white"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`-mt-6 h-0.5 flex-1 transition-all ${
                  step.completed ? "bg-green-500" : "bg-gray-700"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
