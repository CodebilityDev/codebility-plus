import toast from "react-hot-toast";

const showToast = (type: "success" | "error", message: string, id?: string) => {
  toast[type](message, {
    position: "top-center",
    duration: 4000,
    id: id,
  });
};

export const showSuccessToast = (message: string, id?: string) =>
  showToast("success", message, id);

export const showErrorToast = (message: string, statusCode?: number) => {
  let toastMessage = message;

  if (statusCode) {
    switch (statusCode) {
      case 400:
        toastMessage = "Bad request. Please check your input data.";
        break;
      case 401:
        toastMessage = "Unauthorized. Please login and try again.";
        break;
      case 403:
        toastMessage =
          "Forbidden. You do not have permission to perform this action.";
        break;
      case 404:
        toastMessage = "Resource not found. Please check your request URL.";
        break;
      case 500:
        toastMessage = "Internal server error. Please try again later.";
        break;
    }
  }

  showToast("error", toastMessage);
};
