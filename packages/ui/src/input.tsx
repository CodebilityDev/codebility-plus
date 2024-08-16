import * as React from "react"

import { cn } from "@codevs/ui"
import { VariantProps, cva } from "class-variance-authority"

const InputVariants = cva(
  "h-11 rounded-sm placeholder:text-gray bg-muted/50 focus:outline-none text-sm md:text-md sm:text-sm lg:text-lg p-2 rounded-lg [&>span]:line-clamp-1 flex w-full  disabled:opacity-50  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        resume: "",
        lightgray:
          "border border-lightgray bg-white text-black-100 dark:border-zinc-700 dark:bg-dark-200 dark:text-white",
        darkgray: "bg-white text-dark-200 dark:bg-dark-200 dark:text-gray",
      },
    },
  }
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof InputVariants> {
  label?: string
  labelClassName?: string
  parentClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelClassName, parentClassName, className, variant, type, ...props }, ref) => {
    return (
      <div className={cn("pt-4", parentClassName)}>
        <label className={cn(labelClassName)}>{label}</label>
        <input type={type} className={cn(InputVariants({ variant, className }))} ref={ref} {...props} />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
