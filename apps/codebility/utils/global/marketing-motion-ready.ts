"use client";

export function markMarketingMotionReady() {
  if (typeof document === "undefined") return;
  if (document.documentElement.dataset.landingMotion === "ready") return;
  document.documentElement.dataset.landingMotion = "ready";
}
