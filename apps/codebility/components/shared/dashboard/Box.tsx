import React, { ReactNode } from "react";

import { cn } from "@codevs/ui";

interface Box {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

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
