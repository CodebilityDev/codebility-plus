"use client";

import { useEffect } from "react";

const ScrollToHash = () => {
  useEffect(() => {
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
              element.scrollIntoView({ behavior: "auto" });
            }
          } catch (error) {
            // Silently catch any invalid selector errors
            console.warn("Invalid CSS selector:", hash);
          }
        }
      }
    };

    jumpToHash();

    window.addEventListener("popstate", jumpToHash);

    return () => {
      window.removeEventListener("popstate", jumpToHash);
    };
  }, []);

  return null;
};

export default ScrollToHash;
