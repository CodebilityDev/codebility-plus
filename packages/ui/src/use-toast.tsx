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
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        toastTimeouts.forEach((_, id) => {
          if (id === toastId) {
            toastTimeouts.delete(id);
          }
        });

        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        };
      }

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
  toast: (props: Omit<ToasterToast, "id">) => void;
  dismiss: (toastId?: string) => void;
  remove: (toastId?: string) => void;
}>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
  remove: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  const toast = React.useCallback(
    (props: Omit<ToasterToast, "id">) => {
      const id = genId();

      const update = (props: Partial<ToasterToast>) =>
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { ...props, id },
        });

      const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

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
    [dispatch]
  );

  const dismiss = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
    },
    [dispatch]
  );

  const remove = React.useCallback(
    (toastId?: string) => {
      dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
    },
    [dispatch]
  );

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open) {
        toastTimeouts.set(
          toast.id,
          setTimeout(() => {
            dispatch({ type: actionTypes.DISMISS_TOAST, toastId: toast.id });
          }, 5000)
        );
      }

      if (!toast.open && toastTimeouts.has(toast.id)) {
        clearTimeout(toastTimeouts.get(toast.id));
        toastTimeouts.delete(toast.id);

        setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId: toast.id });
        }, TOAST_REMOVE_DELAY);
      }
    });
  }, [state.toasts, dispatch]);

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss, remove }}>
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