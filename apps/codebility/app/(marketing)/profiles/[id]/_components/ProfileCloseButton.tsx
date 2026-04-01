"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ProfileCloseButton() {
  const router = useRouter();

  const handleClose = () => {
    // If they came from somewhere within the app, go back. 
    // In rare cases where they opened directly, they might need to go home, but router.back() handles history.
    router.back();
  };

  return (
    <button
      onClick={handleClose}
      aria-label="Go back"
      className="text-white hover:text-gray-300 transition-colors"
    >
      <X className="h-6 w-6" />
    </button>
  );
}
