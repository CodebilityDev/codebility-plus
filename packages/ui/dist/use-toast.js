"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}
// If you're compiling for the browser only, you could do:
// const toastTimeouts = new Map<string, number>();
// For broader compatibility (Node/SSR + browser), keep ReturnType<typeof setTimeout>
const toastTimeouts = new Map();
const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };
        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) => t.id === action.toast.id ? { ...t, ...action.toast } : t),
            };
        case actionTypes.DISMISS_TOAST: {
            const { toastId } = action;
            if (toastId) {
                // Remove the timer for this toast from the map
                const existingTimeout = toastTimeouts.get(toastId);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                    toastTimeouts.delete(toastId);
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t) => t.id === toastId
                        ? {
                            ...t,
                            open: false,
                        }
                        : t),
                };
            }
            // Dismiss all toasts if no toastId is provided
            return {
                ...state,
                toasts: state.toasts.map((t) => ({
                    ...t,
                    open: false,
                })),
            };
        }
        case actionTypes.REMOVE_TOAST:
            if (action.toastId) {
                return {
                    ...state,
                    toasts: state.toasts.filter((t) => t.id !== action.toastId),
                };
            }
            return {
                ...state,
                toasts: [],
            };
        default:
            return state;
    }
};
const ToastContext = React.createContext({
    toasts: [],
    toast: () => {
        return { id: "", dismiss: () => { }, update: () => { } };
    },
    dismiss: () => { },
    remove: () => { },
});
export function ToastProvider({ children }) {
    const [state, dispatch] = React.useReducer(reducer, { toasts: [] });
    const toast = React.useCallback((props) => {
        const id = genId();
        const update = (updatedProps) => dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...updatedProps, id },
        });
        const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
        dispatch({
            type: actionTypes.ADD_TOAST,
            toast: {
                ...props,
                id,
                open: true,
                onOpenChange: (open) => {
                    if (!open)
                        dismiss();
                },
            },
        });
        return {
            id,
            dismiss,
            update,
        };
    }, [dispatch]);
    const dismiss = React.useCallback((toastId) => {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
    }, [dispatch]);
    const remove = React.useCallback((toastId) => {
        dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
    }, [dispatch]);
    React.useEffect(() => {
        state.toasts.forEach((toast) => {
            // If a toast is open, set a timer to dismiss it
            if (toast.open) {
                toastTimeouts.set(toast.id, setTimeout(() => {
                    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: toast.id });
                }, 5000));
            }
            // If a toast has been closed, clear any existing timer and remove it later
            if (!toast.open && toastTimeouts.has(toast.id)) {
                const timeoutId = toastTimeouts.get(toast.id);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    toastTimeouts.delete(toast.id);
                }
                setTimeout(() => {
                    dispatch({ type: actionTypes.REMOVE_TOAST, toastId: toast.id });
                }, TOAST_REMOVE_DELAY);
            }
        });
    }, [state.toasts, dispatch]);
    return (_jsx(ToastContext.Provider, { value: { toasts: state.toasts, toast, dismiss, remove }, children: children }));
}
export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
//# sourceMappingURL=use-toast.js.map