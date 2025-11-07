import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@codevs/ui";
const TextareaVariants = cva("flex w-full rounded-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2  disabled:opacity-50", {
    variants: {
        variant: {
            default: "border border-gray-300 p-2 focus:border-customBlue-500",
            resume: " md:text-md  resize-none p-2 text-sm sm:text-sm lg:text-lg",
            ghost: "border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const Textarea = React.forwardRef(({ variant, label, id, className, ...props }, ref) => {
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: id, children: label }), _jsx("textarea", { className: cn(TextareaVariants({ variant, className })), ref: ref, ...props })] }));
});
Textarea.displayName = "Textarea";
export { Textarea };
//# sourceMappingURL=textarea.js.map