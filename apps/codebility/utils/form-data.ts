/*
 * Utility function to convert object to FormData
 */

/*
 * Usage:
 * const formData = objectToFormData(obj);
 */
export function objectToFormData(obj: Record<string, any>, prefix = "", formData = new FormData()): FormData {
  for (const [key, value] of Object.entries(obj)) {
    const formKey = prefix ? `${prefix}.${key}` : key;

    if (value instanceof Date) {
      // Convert Date to ISO string
      formData.append(formKey, value.toISOString());
    } else if (value && typeof value === "object" && !(value instanceof File)) {
      // Recursively handle nested objects
      objectToFormData(value, formKey, formData);
    } else {
      // Append primitive values (string, number, etc.), handle null/undefined
      formData.append(formKey, value ?? "");
    }
  }
  return formData;
}
