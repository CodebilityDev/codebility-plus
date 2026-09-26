"use client";

import type { FooterProps } from "@/types/marketing/marketing";
import React from "react";

export const TermsAndConditionFooter: React.FC<FooterProps> = ({ onClose }) => (
  <div className="flex justify-between gap-2">
    <div className="flex flex-col">
      <h1 className="xs:text-2xl text-base font-semibold">
        Terms and Condition
      </h1>
      <p className="text-sm sm:text-base">
        All materials by Codebility are our property. Clients receive a license
        for intended use only. Unauthorized use is prohibited.
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
