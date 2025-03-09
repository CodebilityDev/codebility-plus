import React, { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string; // Optional className prop
  id?: string; // Optional id prop
}

const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`mx-auto py-10 lg:py-20 ${className}`}>
      {children}
    </section>
  );
};

export default Section;
