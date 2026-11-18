"use client";

import Link from "next/link";
import React, { useState } from "react";

import { TERMS_SECTIONS } from "@/constants/global/terms-and-conditions";

export const TermsAndConditionNavBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  return (
    <div className="flex flex-col gap-[10px] overflow-y-auto bg-[#ffffff0d] p-4 md:p-[1.2rem]">
      {TERMS_SECTIONS.map((section, index) => (
        <Link
          key={section.id}
          href={`#${section.id}`}
          onClick={() => setActiveTab(index)}
          className={`px-2 py-1 text-xs sm:whitespace-nowrap sm:px-[1.2rem] sm:py-[10px] sm:text-base ${index === activeTab ? "rounded-[10px] bg-[#222222]" : ""
            }`}
        >
          {section.title}
        </Link>
      ))}
    </div>
  );
}
