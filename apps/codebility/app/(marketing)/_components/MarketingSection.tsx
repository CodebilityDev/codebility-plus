import React, { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string; // Optional className prop
  id?: string; // Optional id prop
}

const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`mx-auto py-8 lg:py-16 ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-16">
        {children}
      </div>
    </section>
  );
};

export default Section;
