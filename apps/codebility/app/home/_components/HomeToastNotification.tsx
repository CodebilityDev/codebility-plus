"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "hasShownToast";

/**
 * One-time welcome toast on /home.
 *
 * Reads localStorage directly inside the effect rather than through a
 * useSyncExternalStore hook: the server snapshot of such a hook is always null,
 * so the first client render reports "not shown yet" and the toast fired on
 * every reload even though the flag was already set. Reading at effect time is
 * after hydration, so it sees the real value.
 */
const ToastNotification = () => {
  const pathname = usePathname();
  const shown = useRef(false);

  useEffect(() => {
    if (pathname !== "/home" || shown.current) return;
    if (localStorage.getItem(STORAGE_KEY) === "true") return;

    shown.current = true;
    toast.success("Congratulations! You are now an official member of Codebility.");
    localStorage.setItem(STORAGE_KEY, "true");
  }, [pathname]);

  return null;
};

export default ToastNotification;
