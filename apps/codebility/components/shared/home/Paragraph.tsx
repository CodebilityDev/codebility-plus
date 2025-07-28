import React, { ReactNode } from "react";

interface Paragraph {
  children: ReactNode;
  className?: string;
}

const Paragraph: React.FC<Paragraph> = ({ children, className }) => {
  return (
    <p className={`text-secondaryColor mb-3 text-sm ${className}`}>
      {children}
    </p>
  );
};
export default Paragraph;
