"use client";

import type { FooterProps } from "@/types/marketing/marketing";
import React from "react";

export const PrivacyPolicyModalFooter: React.FC<FooterProps> = ({ onClose }) => (
  // Line 332-348: CORRECTED - Match Terms compact footer pattern
  <div className="flex justify-between gap-2">
    <div className="flex flex-col">
      <h1 className="xs:text-2xl text-base font-semibold">Privacy Policy</h1>
      <p className="text-sm sm:text-base">
        At Codebility, we are committed to protecting your privacy. This Privacy
        Policy outlines how we collect, use, and protect your information.
      </p>
    </div>
    
    <button
      onClick={onClose}
      className="rounded-[100px] bg-[#ffffff0d] px-4 py-2 sm:px-14 sm:py-5"
    >
      Close
    </button>
  </div>
);
