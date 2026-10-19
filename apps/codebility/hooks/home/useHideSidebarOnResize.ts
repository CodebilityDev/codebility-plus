"use client";

import { useState, useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;

const useHideSidebarOnResize = () => {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Hiding on desktop is derived, so no effect needs to close the sheet.
  return { isSheetOpen: isSheetOpen && !isDesktop, setIsSheetOpen };
};

export default useHideSidebarOnResize;
