import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@codevs/ui";

const TextareaVariants = cva(
  "flex w-full rounded-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2  disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-gray-300 p-2 focus:border-customBlue-500",
        resume: " md:text-md  resize-none p-2 text-sm sm:text-sm lg:text-lg",
        ghost:
          "border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof TextareaVariants> {
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant, label, id, className, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <textarea
          className={cn(TextareaVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
