"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const ToastNotification = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/home") return;
    if (localStorage.getItem("hasShownToast")) return;

    toast.success(
      "Congratulations! You are now an official member of Codebility.",
    );
    localStorage.setItem("hasShownToast", "true");
  }, [pathname]);

  return null;
};

export default ToastNotification;
