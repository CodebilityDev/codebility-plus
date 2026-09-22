"use client";

import { useLayoutEffect } from "react";

import { markMarketingMotionReady } from "./marketing-motion-ready";

export default function MarketingMotionReadyMarker() {
  useLayoutEffect(() => {
    markMarketingMotionReady();
  }, []);

  return null;
}
