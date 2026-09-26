import React from "react";
import type { Paragraph } from "@/types/global/typography";


const Paragraph: React.FC<Paragraph> = ({ children, className }) => {
  return (
    <p className={`text-secondaryColor mb-3 text-sm ${className}`}>
      {children}
    </p>
  );
};
export default Paragraph;
