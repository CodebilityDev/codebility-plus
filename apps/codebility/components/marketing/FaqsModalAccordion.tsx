"use client";

import type { AccordionProps } from "@/types/marketing/marketing";
import React, { useState } from "react";

export const FaqsModalAccordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`rounded-xl px-12 py-7 ${isOpen ? "border border-zinc-400 bg-inherit" : "bg-black-500"}`}
    >
      <button
        onClick={toggleAccordion}
        className="flex w-full items-center justify-between"
      >
        <span className="text-xl font-medium">{title}</span>
        <span className="text-2xl text-[#9747FF]">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <span className="mt-4 flex flex-col gap-4">{children}</span>
        </div>
      )}
    </div>
  );
};
