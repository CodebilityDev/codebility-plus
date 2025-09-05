"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfileCloseButton() {
  const handleClose = () => {
    window.close();
  };

  return (
    <Link href="/">
      <Button
        variant="hollow"
        className="bg-black-200 flex gap-2 border-zinc-700 text-white"
        onClick={handleClose}
      >
        Close
      </Button>
    </Link>
  );
}
