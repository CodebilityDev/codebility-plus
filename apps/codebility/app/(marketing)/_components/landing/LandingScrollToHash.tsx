"use client";

import { useEffect } from "react";

const ScrollToHash = () => {
  useEffect(() => {
    // Force scroll to top on initial page load
    window.scrollTo(0, 0);
    
    // Clear any hash on initial page load to prevent auto-scrolling
    if (window.location.hash) {
      history.replaceState(null, null, window.location.pathname);
      // Force scroll to top again after clearing hash
      setTimeout(() => window.scrollTo(0, 0), 100);
      return;
    }

    const jumpToHash = () => {
      const hash = window.location.hash;

      if (hash) {
        // Check if hash is a valid CSS selector (should start with # and contain only valid characters)
        // Skip hashes that contain URL parameters (= signs, & signs, etc.)
        const isValidSelector = /^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(hash);
        
        if (isValidSelector) {
          try {
            const element = document.querySelector(hash);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          } catch (error) {
            // Silently catch any invalid selector errors
            console.warn("Invalid CSS selector:", hash);
          }
        }
      }
    };

    // Only listen for hash changes after initial load
    window.addEventListener("popstate", jumpToHash);
    window.addEventListener("hashchange", jumpToHash);

    return () => {
      window.removeEventListener("popstate", jumpToHash);
      window.removeEventListener("hashchange", jumpToHash);
    };
  }, []);

  return null;
};

export default ScrollToHash;
