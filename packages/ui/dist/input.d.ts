import * as React from "react";
import { VariantProps } from "class-variance-authority";
declare const InputVariants: (props?: {
    variant?: "default" | "darkgray" | "resume" | "lightgray";
} & import("class-variance-authority/types").ClassProp) => string;
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof InputVariants> {
    label?: string;
    labelClassName?: string;
    parentClassName?: string;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export { Input };
//# sourceMappingURL=input.d.ts.map