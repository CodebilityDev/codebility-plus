"use client";

import { useEffect, useRef } from "react";

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  const saved = useRef(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  const passive = options?.passive ?? type === "scroll";
  const capture = options?.capture ?? false;

  useEffect(() => {
    const listener = (event: WindowEventMap[K]) => saved.current(event);
    window.addEventListener(type, listener, { passive, capture });
    return () => window.removeEventListener(type, listener, { capture });
  }, [type, passive, capture]);
}
