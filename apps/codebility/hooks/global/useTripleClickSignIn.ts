import { useCallback, useRef } from "react";

// Three quick clicks on the logo open the sign-in page.
export function useTripleClickSignIn() {
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(() => {
    clicks.current += 1;
    if (clicks.current === 3) {
      clicks.current = 0;
      window.location.href = "/auth/sign-in";
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => (clicks.current = 0), 1000);
  }, []);
}
