"use client";

import Link from "next/link";
import { Button } from "@/Components/ui/button"

export default function ProfileCloseButton() {
  const handleClose = () => {
    window.close();
  }

  return (
    <Link href="/">
        <Button
            variant="hollow"
            className="flex gap-2 border-zinc-700 bg-black-200 text-white"
            onClick={handleClose}
        >
            Close
        </Button>
    </Link>
  )
}
