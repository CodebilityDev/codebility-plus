"use client";

import { useSyncExternalStore } from "react";

function forceScrollTop() {
  document.documentElement.style.scrollBehavior = "auto";
  document.body.style.scrollBehavior = "auto";
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "auto" });

  if (window.location.hash) {
    const newUrl = window.location.pathname + window.location.search;
    window.history.replaceState({}, document.title, newUrl);
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}

function subscribeForceScrollTop() {
  forceScrollTop();

  const timeouts = [0, 16, 50, 100].map((delay) =>
    setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: "auto" });
    }, delay),
  );

  const restore = setTimeout(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.scrollBehavior = "smooth";
  }, 500);

  return () => {
    timeouts.forEach(clearTimeout);
    clearTimeout(restore);
  };
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

const ForceScrollTop = () => {
  useSyncExternalStore(
    subscribeForceScrollTop,
    getSnapshot,
    getServerSnapshot,
  );
  return null;
};

export default ForceScrollTop;
