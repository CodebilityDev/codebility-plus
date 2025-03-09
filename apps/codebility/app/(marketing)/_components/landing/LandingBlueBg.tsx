import React from "react";

import { cn } from "@codevs/ui";

const BlueBg = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute z-[0] hidden  rounded-full bg-[#2e23a8c3] blur-[400px]  md:block ",
        className,
      )}
    ></div>
  );
};

export default BlueBg;
