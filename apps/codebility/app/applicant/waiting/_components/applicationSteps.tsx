"use client";

import React from "react";

import { ApplicantType } from "../_service/type";
import ApplicantStep1 from "./applicantStep1";
import ApplicantStep2 from "./applicantStep2";
import ApplicantStep3 from "./applicantStep3";
import ApplicantStep4 from "./applicantStep4";
import {
  Stepper,
  StepperBody,
  StepperConnector,
  StepperContent,
  StepperHeader,
  StepperStep,
} from "./Stepper";

export default function ApplicationSteps({
  user,
  applicantData,
}: {
  user: any;
  applicantData: ApplicantType;
}) {
  const steps: { title: string; description?: string }[] = [
    {
      title: "Applying",
      description: "",
    },
    {
      title: "Testing",
      description: "",
    },
    {
      title: "Onboarding",
      description: "",
    },
    {
      title: "Waitlist",
      description: "",
    },
  ];

  const getCurrentStep = (): number => {
    if (user.application_status === "waitlist") {
      return 3;
    } else if (user.application_status === "onboarding") {
      return 2;
    } else if (user.application_status === "testing") {
      return 1;
    } else if (!applicantData?.test_taken) {
      return 0;
    } else {
      return 0;
    }
  };

  const [activeStep, setActiveStep] = React.useState(getCurrentStep());

  return (
    <>
      <Stepper
        activeStep={activeStep}
        onStepChange={setActiveStep}
        steps={steps}
        orientation={"horizontal"}
        className="fixed top-20 z-20 px-10 py-20 sm:px-32 md:px-40"
      >
        <StepperHeader className="-px-4 w-full sm:px-0">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepperStep index={index} className="h-full" />
              {index < steps.length - 1 && <StepperConnector index={index} />}
            </React.Fragment>
          ))}
        </StepperHeader>

        <StepperBody>
          <StepperContent step={0}>
            <ApplicantStep1 setActiveStep={setActiveStep} user={user} />
          </StepperContent>

          <StepperContent step={1}>
            <ApplicantStep2
              setActiveStep={setActiveStep}
              user={user}
              applicantData={applicantData}
            />
          </StepperContent>

          <StepperContent step={2}>
            <ApplicantStep3 setActiveStep={setActiveStep} user={user} applicantData={applicantData} />
          </StepperContent>

          <StepperContent step={3}>
            <ApplicantStep4 user={user} />
          </StepperContent>
        </StepperBody>
      </Stepper>
    </>
  );
}
