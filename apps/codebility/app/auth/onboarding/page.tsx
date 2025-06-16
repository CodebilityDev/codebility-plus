"use client";

import React, { useState } from "react";
import { Button, Step, Stepper } from "@material-tailwind/react";

import Onboarding1 from "./_components/Onboarding1";
import Onboarding2 from "./_components/Onboarding2";
import Onboarding3 from "./_components/Onboarding3";
import Onboarding4 from "./_components/Onboarding4";
import Onboarding5 from "./_components/Onboarding5";
import Onboarding6 from "./_components/Onboarding6";
import Onboarding7 from "./_components/Onboarding7";

const OnboardingPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [highestStep, setHighestStep] = useState(1);

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((cur) => {
        const next = cur + 1;
        setHighestStep((prev) => (next > prev ? next : prev));
        return next;
      });
    }
  };
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

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
          <Stepper
            activeStep={activeStep}
            isLastStep={(value) => setIsLastStep(value)}
            isFirstStep={(value) => setIsFirstStep(value)}
            lineClassName="bg-white/30 h-[0.009rem] opacity-40"
            activeLineClassName="bg-white opacity-30"
            placeholder={undefined}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
            onResize={() => {}}
            onResizeCapture={() => {}}
          >
            <Step
              onClick={() => handleStepClick(0)}
              className={`relative z-10 border border-white/30 bg-[#130a3d] text-white text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center ${0 <= highestStep + 1 ? "cursor-pointer hover:bg-[#1e1252]" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              1
            </Step>
            <Step
              onClick={() => handleStepClick(1)}
              className={`relative z-10 border border-white/30 bg-[#130a3d] text-white text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center ${1 <= highestStep + 1 ? "cursor-pointer hover:bg-[#1e1252]" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              2
            </Step>
            <Step
              onClick={() => handleStepClick(2)}
              className={`relative z-10 border border-white/30 bg-[#130a3d] text-white text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center ${2 <= highestStep + 1 ? "cursor-pointer hover:bg-[#1e1252]" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              3
            </Step>
            <Step
              onClick={() => handleStepClick(3)}
              className={`relative z-10 border border-white/30 bg-[#130a3d] text-white text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center ${3 <= highestStep + 1 ? "cursor-pointer hover:bg-[#1e1252]" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              4
            </Step>
            <Step
              onClick={() => handleStepClick(4)}
              className={`relative z-10 border border-white/30 bg-[#130a3d] text-white text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center ${4 <= highestStep + 1 ? "cursor-pointer hover:bg-[#1e1252]" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              5
            </Step>
            <Step
              onClick={() => handleStepClick(5)}
              className={`relative z-10 border border-white/30 bg-[#130a3d] text-white text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center ${5 <= highestStep + 1 ? "cursor-pointer hover:bg-[#1e1252]" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              6
            </Step>
            <Step
              onClick={() => handleStepClick(6)}
              className={`relative z-10 border border-white/30 bg-[#130a3d] text-white text-xs sm:text-sm md:text-base h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 flex items-center justify-center ${6 <= highestStep + 1 ? "cursor-pointer hover:bg-[#1e1252]" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              onResize={() => {}}
              onResizeCapture={() => {}}
            >
              7
            </Step>
          </Stepper>
        </div>
      </div>

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
