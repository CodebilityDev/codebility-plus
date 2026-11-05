"use client";
import type { ApplicantProfileModalSectionProps } from "@/types/home/applicants/applicants";

export const ApplicantProfileModalSection = ({
  title,
  children,
}: ApplicantProfileModalSectionProps) => (
  <div className="space-y-3">
    <h3 className="text-lg font-medium">{title}</h3>
    {children}
  </div>
);
