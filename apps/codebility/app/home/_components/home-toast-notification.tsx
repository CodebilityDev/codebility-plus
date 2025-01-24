"use client";

// This makes the component a client component
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

const ToastNotification = () => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Set isMounted to true on client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show the toast only after the component has mounted
  useEffect(() => {
    // Check if the toast has been shown before
    const hasShownToast = localStorage.getItem("hasShownToast");

    if (isMounted && pathname === "/home" && !hasShownToast) {
      toast.success(
        "Congratulations! You are now an official member of Codebility.",
      );

      // Set flag in local storage to indicate the toast has been shown
      localStorage.setItem("hasShownToast", "true");
    }
  }, [isMounted]);

  return null;
};

export default ToastNotification;
