"use client";

import React, { ReactNode, useState } from "react";
import { useModal } from "@/hooks/use-modal";

import { Dialog, DialogContent, DialogTitle } from "@codevs/ui";

function FaqsModal() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "homeFAQSModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-black-800 max-w-[1260px]">
        <div className="flex flex-col justify-between gap-4 text-white">
          <DialogTitle className="sr-only">Frequently Asked Questions</DialogTitle>
          
          <div className="flex max-h-[600px] flex-col gap-2 overflow-hidden overflow-y-scroll py-2">
         
            <h1 className="mb-6 text-center text-4xl font-semibold ">
              Frequently Asked Questions
            </h1>
            <Accordion title="Q1 What makes Codebility different from other development companies?">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Phasellus eu
              tempus enim. Etiam viverra a ipsum non feugiat. Sed lobortis eget
              est vitae porttitor. Nullam magna lacus, bibendum a tristique sit
              amet, luctus vitae lorem.
            </Accordion>
            <Accordion title="Q2 What technologies do your developers specialize in?">
              <h3>
                Our developers specialize in a wide range of technologies
                including but not limited to:
              </h3>
              <ul className="ml-4 list-disc marker:text-[#9747FF]">
                <li>Front-end: HTML, CSS, JavaScript, React, Angular, Vue.js</li>
                <li>Back-end: Node.js, Python, Ruby on Rails, PHP, Java</li>
                <li>Mobile: Swift, Kotlin, Flutter, React Native</li>
                <li>
                  AI: Machine Learning, Natural Language Processing, Data Analysis
                </li>
              </ul>
            </Accordion>
            <Accordion title="Q3 How do you ensure the quality of your projects?">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              eu tempus enim. Etiam viverra a ipsum non feugiat. Sed lobortis eget
              est vitae porttitor. Nullam magna lacus, bibendum a tristique sit
              amet, luctus vitae lorem.
            </Accordion>
            <Accordion title="Q4 What kind of support can I expect during and after the project?">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Phasellus eu
              tempus enim. Etiam viverra a ipsum non feugiat. Sed lobortis eget
              est vitae porttitor. Nullam magna lacus, bibendum a tristique sit
              amet, luctus vitae lorem.
            </Accordion>
            <Accordion title="Q5 What benefits do members of the Codebility Community receive?">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Phasellus eu
              tempus enim. Etiam viverra a ipsum non feugiat. Sed lobortis eget
              est vitae porttitor. Nullam magna lacus, bibendum a tristique sit
              amet, luctus vitae lorem.
            </Accordion>
          </div>


          <div className="flex gap-4 self-end">
            <button
              onClick={onClose}
              className="text-semibold rounded-[100px] border border-[#1D1D1E] bg-[#ffffff0D] px-12 py-5"
            >
              Close
            </button>
            <button
              onClick={onClose}
              className="text-semibold rounded-[100px] bg-[#9747FF] px-14 py-5"
            >
              Ask Question
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AccordionProps {
  title: string;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
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

export default FaqsModal;
