"use client";

import { useState, useEffect } from "react";

export function usePageAnimationSettings() {
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState(800);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load preferences from localStorage
    const savedEnabled = localStorage.getItem("pageAnimationEnabled");
    const savedDuration = localStorage.getItem("pageAnimationDuration");

    if (savedEnabled !== null) {
      setEnabled(savedEnabled === "true");
    }
    if (savedDuration !== null) {
      setDuration(parseInt(savedDuration));
    }

    // Listen for settings changes dispatched by PageTransitionSettings
    const handleSettingsChange = (event: any) => {
      if (event.detail) {
        setEnabled(event.detail.enabled);
        setDuration(event.detail.duration);
      }
    };

    window.addEventListener("pageAnimationSettingsChanged", handleSettingsChange as EventListener);
    return () => {
      window.removeEventListener("pageAnimationSettingsChanged", handleSettingsChange as EventListener);
    };
  }, []);

  return { 
    enabled, 
    duration, 
    durationInSeconds: duration / 1000,
    // Provide a standardized "multiplier" to scale other animations proportionally
    multiplier: duration / 800 // Assuming 800ms is our "standard" base
  };
}
