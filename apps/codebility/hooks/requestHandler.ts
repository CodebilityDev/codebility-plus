import { showErrorToast, showSuccessToast } from "@/hooks/toastHandler"

export const handleRequest = async (
  url: string,
  method: string,
  body: Record<string, any>,
  successMessage?: string | null,
  errorMessage?: string
): Promise<Response | null> => {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.warn(`Failure on ${url} route`, response)

      if (!response.status) {
        showErrorToast("Network error. Please check your internet connection.")
      } else {
        if (errorMessage) showErrorToast(errorMessage)
        else showErrorToast(`Error on ${url}`, response.status)
      }

      return null
    }

    if (successMessage) showSuccessToast(successMessage)
    return response
  } catch (error) {
    console.error("Unexpected error", error)
    showErrorToast("An unexpected error occurred. Please try again.")
    return null
  }
}
