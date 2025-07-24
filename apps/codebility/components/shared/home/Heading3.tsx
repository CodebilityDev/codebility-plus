import React, { ReactNode } from "react";

interface Heading3 {
  children: ReactNode;
}

const Heading3: React.FC<Heading3> = ({ children }) => {
  return (
    <h3 className="text-primaryColor mb-3 text-2xl font-semibold">
      {children}
    </h3>
  );
};

export default Heading3;
