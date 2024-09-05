import React, { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const SectionWrapper: React.FC<SectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={`mx-auto max-w-[2560px] px-5 py-24 lg:p-20 lg:py-52 ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
