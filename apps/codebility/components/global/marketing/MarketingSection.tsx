import React from "react";
import type { SectionProps } from "@/types/global/marketing";


const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`mx-auto py-4 lg:py-8 ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-8">
        {children}
      </div>
    </section>
  );
};

export default Section;
