"use client";

import React, { useState } from 'react'
import Onboarding1 from './_components/Onboarding1'
import Onboarding2 from './_components/Onboarding2'
import Onboarding3 from './_components/Onboarding3'
import Onboarding4 from './_components/Onboarding4'
import { Button, Stepper, Step } from '@material-tailwind/react'
import Onboarding5 from './_components/Onboarding5';
import Onboarding6 from './_components/Onboarding6';
import Onboarding7 from './_components/Onboarding7';


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
    <div className="w-full h-screen">
      <div className="absolute bottom-0 left-0 w-full z-20 p-4">
        <div className="w-full px-8 py-4">
          <Stepper
             activeStep={activeStep}
             isLastStep={(value) => setIsLastStep(value)}
             isFirstStep={(value) => setIsFirstStep(value)}
             lineClassName="bg-white/30 h-[0.009rem] opacity-40 "
             activeLineClassName="bg-white opacity-30"
             placeholder={undefined}
             onPointerEnterCapture={() => {}}
             onPointerLeaveCapture={() => {}}
          >
            <Step 
              onClick={() => handleStepClick(0)} 
              className={`z-10 relative bg-[#130a3d] border border-white/30 text-white ${0 <= highestStep + 1 ? "hover:bg-[#1e1252] cursor-pointer" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
            >
              1
            </Step>
            <Step 
              onClick={() => handleStepClick(1)} 
              className={`z-10 relative bg-[#130a3d] border border-white/30 text-white ${1 <= highestStep + 1 ? "hover:bg-[#1e1252] cursor-pointer" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
            >
              2
            </Step>
            <Step 
              onClick={() => handleStepClick(2)} 
              className={`z-10 relative bg-[#130a3d] border border-white/30 text-white ${2 <= highestStep + 1 ? "hover:bg-[#1e1252] cursor-pointer" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
            >
              3
            </Step>
            <Step 
              onClick={() => handleStepClick(3)} 
              className={`z-10 relative bg-[#130a3d] border border-white/30 text-white ${3 <= highestStep + 1 ? "hover:bg-[#1e1252] cursor-pointer" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
            >
              4
            </Step>
            <Step 
              onClick={() => handleStepClick(4)} 
              className={`z-10 relative bg-[#130a3d] border border-white/30 text-white ${4 <= highestStep + 1 ? "hover:bg-[#1e1252] cursor-pointer" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
            >
              5
            </Step>
            <Step 
              onClick={() => handleStepClick(5)} 
              className={`z-10 relative bg-[#130a3d] border border-white/30 text-white ${5 <= highestStep + 1 ? "hover:bg-[#1e1252] cursor-pointer" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
            >
              6
            </Step>
            <Step 
              onClick={() => handleStepClick(6)} 
              className={`z-10 relative bg-[#130a3d] border border-white/30 text-white ${6 <= highestStep + 1 ? "hover:bg-[#1e1252] cursor-pointer" : "cursor-not-allowed"}`}
              activeClassName="bg-white text-black hover:text-white"
              completedClassName="bg-white text-black hover:text-white"
              placeholder={undefined}
            >
              7
            </Step>
          </Stepper>
        </div>
      </div>
      
      {activeStep === 0 && <Onboarding1 onNext={handleNext} />}
      {activeStep === 1 && <Onboarding2 onNext={handleNext} onPrev={handlePrev} />}
      {activeStep === 2 && <Onboarding3 onNext={handleNext} onPrev={handlePrev} />}
      {activeStep === 3 && <Onboarding4 onNext={handleNext} onPrev={handlePrev} />}
      {activeStep === 4 && <Onboarding5 onNext={handleNext} onPrev={handlePrev} />}
      {activeStep === 5 && <Onboarding6 onNext={handleNext} onPrev={handlePrev} />}
      {activeStep === 6 && <Onboarding7 onPrev={handlePrev} />}
    </div>
  )
}

export default OnboardingPage