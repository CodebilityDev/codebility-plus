import React, { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string; // Optional className prop
  id?: string; // Optional id prop
}

const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-16 max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default Section;
