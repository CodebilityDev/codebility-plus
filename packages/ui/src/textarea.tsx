import * as React from "react"
import { cn } from "@codevs/ui"
import { VariantProps, cva } from "class-variance-authority"

const TextareaVariants = cva(
  "flex w-full rounded-sm disabled:opacity-50 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border border-gray-300 p-2 focus:border-blue-500",
        resume: " resize-none  text-sm md:text-md sm:text-sm lg:text-lg p-2",
        ghost: "border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof TextareaVariants> {
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant, label, id, className, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <textarea className={cn(TextareaVariants({ variant, className }))} ref={ref} {...props} />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
