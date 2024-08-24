"use client";

import { useFormContext } from "react-hook-form";
import { type ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { formState } = useFormContext();
  const { isSubmitting } = formState; // Access submission state

  return (
    <button
      {...props}
      className="bg-black h-8 flex items-center justify-center font-medium text-sm hover:bg-slate-800 transition-colors text-white rounded-md text-foreground"
      type="submit"
      disabled={isSubmitting} // Disable button while submitting
      aria-disabled={isSubmitting}
    >
      {isSubmitting ? pendingText : children}
    </button>
  );
}
