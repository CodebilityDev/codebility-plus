import React, { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string; // Optional className prop
  id?: string; // Optional id prop
}

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
