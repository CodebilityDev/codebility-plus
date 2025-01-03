import React, { ReactNode } from "react";

interface CodevHeading {
  children: ReactNode;
}

const CodevHeading: React.FC<CodevHeading> = ({ children }) => {
  return <p className="text-teal mb-4 text-lg">{children}</p>;
};

export default CodevHeading;
