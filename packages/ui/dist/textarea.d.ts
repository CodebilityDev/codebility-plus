import * as React from "react";
import { VariantProps } from "class-variance-authority";
declare const TextareaVariants: (props?: {
    variant?: "default" | "ghost" | "resume";
} & import("class-variance-authority/types").ClassProp) => string;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof TextareaVariants> {
    label?: string;
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
export { Textarea };
//# sourceMappingURL=textarea.d.ts.map