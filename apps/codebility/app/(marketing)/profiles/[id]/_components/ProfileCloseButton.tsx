"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ProfileCloseButton() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Button
      onClick={handleClose}
      aria-label="Go back"
      className="text-white hover:text-gray-300 transition-colors p-2"
      variant={"ghost"}
      size={"icon"}
    >
      <X />
    </Button>
  );
}
