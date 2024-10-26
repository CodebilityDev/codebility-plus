"use client"; // This makes the component a client component
import { memo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ToastNotification = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true on client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show the toast only after the component has mounted
  useEffect(() => {
    if (isMounted) {
      toast.success("Congratulations! You are now an official member of Codebility.");
    }
  }, [isMounted]);

  return null;
};

export default ToastNotification
