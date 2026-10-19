"use client";

import Link from "next/link";
import React, { useState } from "react";

export const TermsAndConditionNavBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabs = [
    "Services Provided",
    "Client Obligations",
    "Confidentiality",
    "Intellectual Property",
    "Termination",
    "Limitation of Liability",
    "Dispute Resolution",
    "Contact Information",
  ];
  return (
    <div className="flex flex-col gap-[10px] bg-[#ffffff0d] p-4 md:p-[1.2rem]">
      {tabs.map((tab, index) => (
        <Link
          key={index}
          href={`#${tab}`}
          onClick={() => setActiveTab(index)}
          className={`px-2 py-1 text-xs sm:whitespace-nowrap sm:px-[1.2rem] sm:py-[10px] sm:text-base ${index === activeTab ? "rounded-[10px] bg-[#222222]" : ""
            }`}
        >
          {tab}
        </Link>
      ))}
    </div>
  );
};
