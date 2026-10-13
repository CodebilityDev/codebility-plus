import React from "react";
import type { IntroText } from "@/types/global/typography";


const IntroText: React.FC<IntroText> = ({ children }) => {
  return <p className="mb-3 text-lg text-gray-600 dark:text-gray-400">{children}</p>;
};

export default IntroText;
