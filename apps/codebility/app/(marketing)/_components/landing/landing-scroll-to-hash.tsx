"use client";

import { useEffect } from "react";

const ScrollToHash = () => {
  useEffect(() => {
    // Function to handle jumping to the element specified by the hash
    const jumpToHash = () => {
      const hash = window.location.hash;
      // console.log(hash)
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          // Directly scroll to the element without animation
          element.scrollIntoView({ behavior: "auto" });
        }
      }
    };

    // Initial jump if hash is present
    jumpToHash();

    // Handle hash changes when navigating through history
    window.addEventListener("popstate", jumpToHash);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("popstate", jumpToHash);
    };
  }, []);

  return null;
};

export default ScrollToHash;
