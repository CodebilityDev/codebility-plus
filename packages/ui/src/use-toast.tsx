"use client";

import * as React from "react";

import type { ToastActionElement, ToastProps } from "./toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

// If you're compiling for the browser only, you could do:
// const toastTimeouts = new Map<string, number>();
// For broader compatibility (Node/SSR + browser), keep ReturnType<typeof setTimeout>
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
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
          toasts: state.toasts.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  open: false,
                }
              : t,
          ),
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

const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, "id">) => {
    id: string;
    dismiss: () => void;
    update: (props: Partial<ToasterToast>) => void;
  };
  dismiss: (toastId?: string) => void;
  remove: (toastId?: string) => void;
}>({
  toasts: [],
  toast: () => {
    return { id: "", dismiss: () => {}, update: () => {} };
  },
  dismiss: () => {},
  remove: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const toast = React.useCallback(
    (props: Omit<ToasterToast, "id">) => {
      const id = genId();

      const update = (updatedProps: Partial<ToasterToast>) =>
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { ...updatedProps, id },
        });

      const dismiss = () =>
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss();
          },
        },
      });

      return {
        id,
        dismiss,
        update,
      };
    },
    [dispatch],
  );

  const dismiss = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
    },
    [dispatch],
  );

  const remove = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
    },
    [dispatch],
  );

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      // If a toast is open, set a timer to dismiss it
      if (toast.open) {
        toastTimeouts.set(
          toast.id,
          setTimeout(() => {
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId: toast.id });
          }, 5000),
        );
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

  return (
    <ToastContext.Provider
      value={{ toasts: state.toasts, toast, dismiss, remove }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = React.useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
