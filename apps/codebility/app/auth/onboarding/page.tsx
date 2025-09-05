"use client";

import React, { useState } from "react";

import Onboarding1 from "./_components/Onboarding1";
import Onboarding2 from "./_components/Onboarding2";
import Onboarding3 from "./_components/Onboarding3";
import Onboarding4 from "./_components/Onboarding4";
import Onboarding5 from "./_components/Onboarding5";
import Onboarding6 from "./_components/Onboarding6";
import Onboarding7 from "./_components/Onboarding7";

// Custom Step Component
interface StepProps {
  number: number;
  isActive: boolean;
  isCompleted: boolean;
  isClickable: boolean;
  onClick: () => void;
}

const CustomStep: React.FC<StepProps> = ({
  number,
  isActive,
  isCompleted,
  isClickable,
  onClick,
}) => {
  const getStepClassName = () => {
    let baseClasses = "relative z-10 border border-white/30 text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full transition-all duration-200";
    
    if (isActive) {
      return `${baseClasses} bg-white text-black`;
    } else if (isCompleted) {
      return `${baseClasses} bg-white text-black`;
    } else if (isClickable) {
      return `${baseClasses} bg-[#130a3d] text-white cursor-pointer hover:bg-[#1e1252]`;
    } else {
      return `${baseClasses} bg-[#130a3d] text-white cursor-not-allowed opacity-50`;
    }
  };

  return (
    <div
      className={getStepClassName()}
      onClick={isClickable ? onClick : undefined}
    >
      {number}
    </div>
  );
};

// Custom Stepper Component
interface StepperProps {
  activeStep: number;
  totalSteps: number;
  highestStep: number;
  onStepClick: (step: number) => void;
}

const CustomStepper: React.FC<StepperProps> = ({
  activeStep,
  totalSteps,
  highestStep,
  onStepClick,
}) => {
  return (
    <div className="flex items-center justify-between w-full relative">
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          <CustomStep
            number={index + 1}
            isActive={activeStep === index}
            isCompleted={index < activeStep}
            isClickable={index <= highestStep + 1}
            onClick={() => onStepClick(index)}
          />
          {index < totalSteps - 1 && (
            <div className="flex-1 h-[1px] mx-2">
              <div
                className={`h-full transition-all duration-300 ${
                  index < activeStep
                    ? "bg-white opacity-30"
                    : "bg-white/30 opacity-40"
                }`}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OnboardingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [highestStep, setHighestStep] = useState(1);

  const totalSteps = 7;
  const isLastStep = activeStep === totalSteps - 1;
  const isFirstStep = activeStep === 0;

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((cur) => {
        const next = cur + 1;
        setHighestStep((prev) => (next > prev ? next : prev));
        return next;
      });
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setActiveStep((cur) => cur - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= highestStep + 1) {
      setActiveStep(step);
      setHighestStep((prev) => (step > prev ? step : prev));
    }
  };

  return (
    <div className="h-screen w-full">
      {/* Mobile responsive stepper container */}
      <div className="absolute bottom-0 left-0 z-20 w-full p-2 sm:p-4">
        <div className="w-full px-2 py-2 sm:px-8 sm:py-4">
          <CustomStepper
            activeStep={activeStep}
            totalSteps={totalSteps}
            highestStep={highestStep}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Onboarding Steps */}
      {activeStep === 0 && <Onboarding1 onNext={handleNext} />}
      {activeStep === 1 && (
        <Onboarding2 onNext={handleNext} onPrev={handlePrev} />
      )}
      {activeStep === 2 && (
        <Onboarding3 onNext={handleNext} onPrev={handlePrev} />
      )}
      {activeStep === 3 && (
        <Onboarding4 onNext={handleNext} onPrev={handlePrev} />
      )}
      {activeStep === 4 && (
        <Onboarding5 onNext={handleNext} onPrev={handlePrev} />
      )}
      {activeStep === 5 && (
        <Onboarding6 onNext={handleNext} onPrev={handlePrev} />
      )}
      {activeStep === 6 && <Onboarding7 onPrev={handlePrev} />}
    </div>
  );
};

export default OnboardingPage;