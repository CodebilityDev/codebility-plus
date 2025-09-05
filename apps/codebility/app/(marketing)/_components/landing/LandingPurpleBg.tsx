import React from "react";

import { cn } from "@codevs/ui";

const PurpleBg = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute z-[0] rounded-full bg-gradient-to-r from-[#2e23a8c3] to-[#9747FF] blur-[400px] ",
        className,
      )}
    ></div>
  );
};

export default PurpleBg;
