import React from "react";
import type { SectionProps } from "@/types/global/typography";


const SectionWrapper: React.FC<SectionProps> = ({
  children,
  className,
  id,
}) => {
  return (
    <section
      id={id}
      className={`mx-auto max-w-[2560px] px-5 py-20 lg:p-20 lg:py-40 ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionWrapper;
