import type * as React from "react";
import type { ApplicantType } from "@/types/applicant/waiting/applicant-waiting";
import type { WaitingUser } from "@/types/global/waiting-user";


export interface Step {
  title: string;
  description?: string;
  optional?: boolean;
}

export interface StepperContextValue {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  steps: Step[];
  onChange: (step: number) => void;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
  steps: Step[];
  onStepChange?: (step: number) => void;
}

export interface ApplicantStep1Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: WaitingUser;
}

export interface ApplicantStep2Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: WaitingUser;
  applicantData: ApplicantType;
}

export interface ApplicantStep3Props {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: WaitingUser;
  applicantData: ApplicantType;
}

export interface ApplicantStep4Props {
  user: WaitingUser;
}

export interface ApplicationStepsProps {
  user: WaitingUser;
  applicantData: ApplicantType;
}

export interface PostReadInstructionsProps {
  applicantData: ApplicantType;
  user: WaitingUser;
}

export interface PostSubmittedProps {
  applicantData: ApplicantType;
  user: WaitingUser;
}

export interface PreReadInstructionsProps {
  applicantData: ApplicantType;
  user: WaitingUser;
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