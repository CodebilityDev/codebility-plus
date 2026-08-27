"use client";

export function markLandingMotionReady() {
  if (typeof document === "undefined") return;
  if (document.documentElement.dataset.landingMotion === "ready") return;
  document.documentElement.dataset.landingMotion = "ready";
}
