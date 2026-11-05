"use client";

import { Button } from "@/components/global/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const CareersSignIn = () => {
  const pathname = usePathname();
  if (pathname !== "/careers") return null;
  return (
    <Link href="/auth/sign-in">
      <Button
        variant="default"
        rounded="full"
        size="lg"
        className="hidden lg:block"
      >
        Sign In
      </Button>
    </Link>
  );
};
