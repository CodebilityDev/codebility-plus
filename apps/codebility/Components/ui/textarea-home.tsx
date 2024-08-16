import * as React from "react"

import { cn } from "@codevs/ui"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, id, className, ...props }, ref) => {
  return (
    <div className="md:text-md flex flex-col  gap-1 sm:text-sm lg:text-lg">
      <label htmlFor={id} className="text-white">
        {label}
      </label>
      <textarea
        className={cn(
          "rounded-lg border border-zinc-800 bg-black-100 p-2 placeholder:text-gray focus:outline-none focus:ring-1 focus:ring-blue-100",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
