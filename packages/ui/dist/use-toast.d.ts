import * as React from "react";
import type { ToastActionElement, ToastProps } from "./toast";
type ToasterToast = ToastProps & {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
};
export declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare const useToast: () => {
    toasts: ToasterToast[];
    toast: (props: Omit<ToasterToast, "id">) => {
        id: string;
        dismiss: () => void;
        update: (props: Partial<ToasterToast>) => void;
    };
    dismiss: (toastId?: string) => void;
    remove: (toastId?: string) => void;
};
export {};
//# sourceMappingURL=use-toast.d.ts.map