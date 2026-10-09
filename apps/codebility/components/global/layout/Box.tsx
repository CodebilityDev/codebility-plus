import React from "react";

import { cn } from "@codevs/ui";
import type { Box } from "@/types/global/layout";


const Box: React.FC<Box> = ({ children, className, onClick }) => {
  return (
    <div
      className={cn(
        "background-box text-dark100_light900 rounded border border-zinc-200 p-6 shadow-sm dark:border-zinc-700",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Box;
