import React, { ReactNode } from "react";

interface IntroText {
  children: ReactNode;
}

const IntroText: React.FC<IntroText> = ({ children }) => {
  return <p className="mb-3 text-lg text-gray-600 dark:text-gray-400">{children}</p>;
};

export default IntroText;
