"use client";

import { useEffect } from "react";

const ScrollToHash = () => {
  useEffect(() => {
    const jumpToHash = () => {
      const hash = window.location.hash;

      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "auto" });
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
