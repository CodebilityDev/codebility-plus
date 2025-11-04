"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@codevs/ui";
import { buttonVariants } from "./button";
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (_jsx(AlertDialogPrimitive.Overlay, { className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className), ...props, ref: ref })));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (_jsxs(AlertDialogPortal, { children: [_jsx(AlertDialogOverlay, {}), _jsx(AlertDialogPrimitive.Content, { ref: ref, className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-&lsqb;state=closed&rsqb;:slide-out-to-top-&lsqb;48%&rsqb; data-[state=open]:slide-in-from-left-1/2 data-&lsqb;state=open&rsqb;:slide-in-from-top-&lsqb;48%&rsqb; sm:rounded-lg", className), ...props })] })));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props }));
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => (_jsx("div", { className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className), ...props }));
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx(AlertDialogPrimitive.Title, { ref: ref, className: cn("text-lg font-semibold", className), ...props })));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx(AlertDialogPrimitive.Description, { ref: ref, className: cn("text-sm text-muted-foreground", className), ...props })));
AlertDialogDescription.displayName =
    AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (_jsx(AlertDialogPrimitive.Action, { ref: ref, className: cn(buttonVariants(), className), ...props })));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (_jsx(AlertDialogPrimitive.Cancel, { ref: ref, className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className), ...props })));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, };
//# sourceMappingURL=alert-dialog.js.map