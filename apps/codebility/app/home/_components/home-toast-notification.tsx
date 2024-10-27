"use client"; // This makes the component a client component
import {  useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";

const ToastNotification = () => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Set isMounted to true on client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show the toast only after the component has mounted
  useEffect(() => {
    if (isMounted && pathname === "/home") {
      toast.success("Congratulations! You are now an official member of Codebility.");
    }
  }, [isMounted]);

  return null;
};

export default ToastNotification
