"use client";

import { useSyncExternalStore } from "react";

function jumpToHash() {
  const hash = window.location.hash;
  if (!hash) return;

  const isValidSelector = /^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(hash);
  if (!isValidSelector) return;

  try {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  } catch {
    console.warn("Invalid CSS selector:", hash);
  }
}

function subscribeHashScroll(onStoreChange: () => void) {
  window.scrollTo(0, 0);

  let clearHashTimeout: ReturnType<typeof setTimeout> | undefined;

  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname);
    clearHashTimeout = setTimeout(() => window.scrollTo(0, 0), 100);
  }

  const onHash = () => {
    jumpToHash();
    onStoreChange();
  };

  window.addEventListener("popstate", onHash);
  window.addEventListener("hashchange", onHash);

  return () => {
    if (clearHashTimeout) clearTimeout(clearHashTimeout);
    window.removeEventListener("popstate", onHash);
    window.removeEventListener("hashchange", onHash);
  };
}

function getSnapshot() {
  return window.location.hash;
}

function getServerSnapshot() {
  return "";
}

const ScrollToHash = () => {
  useSyncExternalStore(subscribeHashScroll, getSnapshot, getServerSnapshot);
  return null;
};

export default ScrollToHash;
