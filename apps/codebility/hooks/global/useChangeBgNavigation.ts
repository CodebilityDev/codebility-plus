"use client";

import { useState } from "react";

import { useWindowEvent } from "@/hooks/global/useWindowEvent";

const useChangeBgNavigation = () => {
  const [color, setColor] = useState(false);

  useWindowEvent("scroll", () => {
    setColor(window.scrollY >= 90);
  });

  return { color };
};

export default useChangeBgNavigation;
