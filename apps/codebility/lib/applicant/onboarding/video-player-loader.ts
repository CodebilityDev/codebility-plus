import type { YTNamespace } from "@/types/applicant/onboarding/onboarding";

// Loads the YouTube IFrame API exactly once and resolves when it is ready.
export let ytApiPromise: Promise<YTNamespace> | null = null;

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API can only load in the browser"));
  }
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) {
    return ytApiPromise;
  }

  ytApiPromise = new Promise<YTNamespace>((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) resolve(window.YT);
    };

    // Fallback: if the script was already injected elsewhere, poll for readiness.
    const poll = window.setInterval(() => {
      if (window.YT && window.YT.Player) {
        window.clearInterval(poll);
        resolve(window.YT);
      }
    }, 100);

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  });

  return ytApiPromise;
}
