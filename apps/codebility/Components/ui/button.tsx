import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@codevs/ui"

const buttonVariants = cva(
  "inline-flex w-full items-center justify-center duration-300 px-6 py-2 whitespace-nowrap rounded-md text-md lg:text-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-white hover:bg-blue-200",
        hollow:
          "dark:bg-[#444857] dark:border dark:border-[#8e8e8e] hover:opacity-80 border dark:text-white bg-white border-[#8e8e8e] border",
        link: "text-dark-100 dark:text-white hover:text-blue-100  hover:dark:text-blue-100",
        destructive: "bg-red-100 text-white hover:bg-red-200",
        secondary: "primary-gradient hover:opacity-80",
        gradient: "bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300",
        outlined: "bg-transparent text-white border-white border",
        purple: "bg-[#9747FF] text-white dark:text-black",
        darkgray: "bg-[#ffffff]/15 border-2 border-[#ffffff]/15 hover:bg-[#C108FE] text-white",
      },
      size: {
        default: "h-10",
        sm: "h-9 rounded-md",
        lg: "h-12 rounded-md",
        icon: "h-10 w-10",
      },
      rounded: {
        none: "",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, rounded, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, rounded, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
