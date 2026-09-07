import toast from "react-hot-toast";

export enum ToastTypes {
  SUCCESS = "Success",
  ERROR = "Error",
}

interface UseToastProps {
  Toast: (description: string, type?: ToastTypes) => void;
}

export function useToast(): UseToastProps {
  const Toast = (
    description: string,
    type: ToastTypes = ToastTypes.SUCCESS,
  ) => {
    return type === ToastTypes.SUCCESS
      ? toast.success(description)
      : toast.error(description);
  };

  return { Toast };
}