import type * as React from "react";
import type { ApplicantType } from "@/types/applicant/waiting/applicant-waiting";


export type Step = {
  title: string;
  description?: string;
  optional?: boolean;
};

export type StepperContextValue = {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  steps: Step[];
  onChange: (step: number) => void;
};

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
  steps: Step[];
  onStepChange?: (step: number) => void;
}

export interface ApplicantStep1Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
}

export interface ApplicantStep2Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
  applicantData: ApplicantType;
}

export interface ApplicantStep3Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
  applicantData: ApplicantType;
}

export interface ApplicantStep4Props { user: any }

export interface ApplicationStepsProps {
  user: any;
  applicantData: ApplicantType;
}

export interface PostReadInstructionsProps {
  applicantData: ApplicantType;
  user: any;
}

export interface PostSubmittedProps {
  applicantData: ApplicantType;
  user: any;
}

export interface PreReadInstructionsProps {
  applicantData: ApplicantType;
  user: any;
}

export interface TestCountdownProps {
  applicantData: ApplicantType;
}

export interface TestInstructionProps {
  children: React.ReactNode;
  applicantData: ApplicantType;
}

export interface TestQAInstructionProps {
  children: React.ReactNode;
  applicantData: ApplicantType;
}
