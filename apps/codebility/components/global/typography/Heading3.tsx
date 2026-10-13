import React from "react";
import type { Heading3 } from "@/types/global/typography";


const Heading3: React.FC<Heading3> = ({ children }) => {
  return (
    <h3 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
      {children}
    </h3>
  );
};

export default Heading3;
