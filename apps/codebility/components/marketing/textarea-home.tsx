import * as React from "react";

import { cn } from "@codevs/ui";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <div className="md:text-md flex flex-col  gap-1 sm:text-sm lg:text-lg">
        <label htmlFor={id} className="text-white">
          {label}
        </label>
        <textarea
          className={cn(
            "bg-black-100 placeholder:text-gray rounded-lg border border-zinc-800 p-2 focus:outline-none focus:ring-1 focus:ring-customBlue-100",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
