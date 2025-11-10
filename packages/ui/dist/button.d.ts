import type { VariantProps } from "class-variance-authority";
import * as React from "react";
declare const buttonVariants: (props?: {
    variant?: "default" | "destructive" | "link" | "outline" | "secondary" | "ghost" | "purple" | "darkgray";
    size?: "default" | "sm" | "lg" | "icon";
} & import("class-variance-authority/types").ClassProp) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { Button, buttonVariants };
//# sourceMappingURL=button.d.ts.map