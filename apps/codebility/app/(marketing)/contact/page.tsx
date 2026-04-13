"use client";

import { useState } from "react";
import {
  IconActivityLog,
  IconApplicant,
  IconHuman,
} from "@/public/assets/svgs";

import InquiryForm from "./_components/ContactInquiryInform";
import ShortSurvey from "./_components/ContactShortSurvey";
import Appointment from "./_components/ContactAppointment";

const steps = [
  { label: "Inquiry Form", icon: <IconHuman /> },
  { label: "Short Survey", icon: <IconApplicant /> },
  { label: "Set an Appointment", icon: <IconActivityLog /> },
];

export interface ContactFormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  industry: string;
  // Step 2
  serviceInterest: string;
  projectType: string;
  featuresNeeded: string;
  referralSource: string;
  interestLevel: number;
  otherRequirements: string;
}

const Contact = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "", lastName: "", email: "",
    companyName: "", phoneNumber: "", industry: "",
    serviceInterest: "", projectType: "", featuresNeeded: "",
    referralSource: "", interestLevel: 0, otherRequirements: "",
  });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const updateFormData = (data: Partial<ContactFormData>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  const progressWidth = `${(currentStep / (steps.length - 1)) * 100}%`;

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-5 py-10">

        {/* Stepper */}
        <div className="relative w-full">
          {/* Connector: circle 1 → circle 2 */}
          <div
            className={`absolute top-5 h-[2px] transition-all duration-500 ${
              currentStep > 0 ? "bg-violet-600" : "bg-white/5"
            }`}
            style={{ left: "calc(16.666% + 20px)", right: "calc(33.333% + 20px)" }}
          />
          {/* Connector: circle 2 → circle 3 */}
          <div
            className={`absolute top-5 h-[2px] transition-all duration-500 ${
              currentStep > 1 ? "bg-violet-600" : "bg-white/5"
            }`}
            style={{ left: "calc(50% + 20px)", right: "calc(16.666% + 20px)" }}
          />

          <div className="relative flex items-start">
            {steps.map((step, i) => {
              const isDone = i < currentStep;
              const isActive = i === currentStep;

              return (
                <div key={i} className="relative z-10 flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-all duration-300 ${
                      isDone
                        ? "border-violet-600 bg-violet-600 text-white"
                        : isActive
                        ? "border-violet-500 bg-violet-500 text-white ring-4 ring-violet-500/25"
                        : "border-white/5 bg-white/5 text-white/30"
                    }`}
                  >
                    {isDone ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <p
                    className={`text-center text-xs transition-colors duration-300 ${
                      isDone
                        ? "font-medium text-violet-500"
                        : isActive
                        ? "font-semibold text-violet-400"
                        : "font-medium text-white/30"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] w-full rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-violet-600 transition-all duration-500"
            style={{ width: progressWidth }}
          />
        </div>

        {/* Step Panels */}
        {currentStep === 0 && (
          <InquiryForm
            defaultValues={formData}
            onNext={(data) => { updateFormData(data); goNext(); }}
          />
        )}
        {currentStep === 1 && (
          <ShortSurvey
            defaultValues={formData}
            onNext={(data) => { updateFormData(data); goNext(); }}
            onBack={goBack}
          />
        )}
        {currentStep === 2 && (
          <Appointment
            formData={formData}
            onBack={goBack}
          />
        )}

        {/* Security note */}
        <div className="flex w-full items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-4 py-3">
          <svg className="h-4 w-4 shrink-0 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-white/40">
            We prioritize the security of your information. Rest assured, we will ensure that your data remains safe with us.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Contact;