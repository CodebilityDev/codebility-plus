"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateVideoProgress } from "../_service/action";

interface VideoPlayerProps {
  videoNumber: number;
  videoId: string;
  applicantId: string;
  onVideoComplete: () => void;
  canWatch: boolean;
}

// Percentage of the video that must be watched before it counts as completed.
const COMPLETION_THRESHOLD = 98;
// How often (ms) we poll the YouTube player for the current playback position.
const POLL_INTERVAL_MS = 500;

// --- Minimal YouTube IFrame API typings (avoids `any`) ---
interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  destroy: () => void;
}

interface YTPlayerStateChangeEvent {
  data: number;
  target: YTPlayer;
}

interface YTPlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  host?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: YTPlayerStateChangeEvent) => void;
    onError?: (event: { data: number }) => void;
  };
}

interface YTNamespace {
  Player: new (element: HTMLElement | string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
    UNSTARTED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Loads the YouTube IFrame API exactly once and resolves when it is ready.
let ytApiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
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

export default function VideoPlayer({
  videoNumber,
  videoId,
  applicantId,
  onVideoComplete,
  canWatch,
}: VideoPlayerProps) {
  // React-owned host element. We append YouTube's target div imperatively so
  // React never tries to reconcile the iframe the API injects.
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pollRef = useRef<number | null>(null);
  const progressSavedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveVideoProgress = async (watched: number, total: number) => {
    if (progressSavedRef.current) return;
    progressSavedRef.current = true;

    try {
      await updateVideoProgress({
        applicantId,
        videoNumber,
        watchedDuration: watched,
        totalDuration: total,
        completed: true,
      });
      onVideoComplete();
    } catch (err) {
      console.error("Failed to save progress:", err);
      // Reset so the user can try again.
      progressSavedRef.current = false;
    }
  };

  useEffect(() => {
    if (!canWatch || !videoId) return;

    let cancelled = false;

    // Reset per-video state whenever the active video changes.
    progressSavedRef.current = false;
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setHasWatched(false);
    setError(null);
    setIsBuffering(true);

    const stopPolling = () => {
      if (pollRef.current !== null) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    const tick = () => {
      const player = playerRef.current;
      if (!player) return;

      const cur = player.getCurrentTime() || 0;
      const total = player.getDuration() || 0;
      setCurrentTime(cur);
      setDuration(total);

      if (total > 0) {
        const percentWatched = (cur / total) * 100;
        setProgress(percentWatched);

        if (percentWatched >= COMPLETION_THRESHOLD && !progressSavedRef.current) {
          setHasWatched(true);
          saveVideoProgress(cur, total);
        }
      }
    };

    const startPolling = () => {
      if (pollRef.current !== null) return;
      pollRef.current = window.setInterval(tick, POLL_INTERVAL_MS);
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return;

        // Give the API its own element so destroying it never fights React.
        const target = document.createElement("div");
        hostRef.current.innerHTML = "";
        hostRef.current.appendChild(target);

        playerRef.current = new YT.Player(target, {
          videoId,
          width: "100%",
          height: "100%",
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            rel: 0, // limit "related" videos to the same channel
            modestbranding: 1,
            playsinline: 1,
            controls: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              setIsBuffering(false);
              const total = playerRef.current?.getDuration() || 0;
              if (total > 0) setDuration(total);
            },
            onStateChange: (event) => {
              if (cancelled || !window.YT) return;
              const state = window.YT.PlayerState;

              if (event.data === state.PLAYING) {
                setIsBuffering(false);
                startPolling();
              } else if (event.data === state.BUFFERING) {
                setIsBuffering(true);
              } else if (event.data === state.PAUSED) {
                stopPolling();
              } else if (event.data === state.ENDED) {
                stopPolling();
                const player = playerRef.current;
                if (player) {
                  const total = player.getDuration() || 0;
                  if (!progressSavedRef.current && total > 0) {
                    setProgress(100);
                    setHasWatched(true);
                    saveVideoProgress(total, total);
                  }
                }
              }
            },
            onError: () => {
              if (cancelled) return;
              setIsBuffering(false);
              setError(
                "Failed to load video. Please refresh the page or try again later.",
              );
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setIsBuffering(false);
          setError("Failed to load the video player. Please refresh the page.");
        }
      });

    return () => {
      cancelled = true;
      stopPolling();
      try {
        playerRef.current?.destroy();
      } catch {
        // Player may already be torn down; ignore.
      }
      playerRef.current = null;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, canWatch]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRetry = () => {
    setError(null);
    setIsBuffering(true);
    // Re-run the build effect by toggling nothing; simplest is a full reload of
    // the player via re-mount. Recreate by clearing and reloading the page area.
    if (typeof window !== "undefined") window.location.reload();
  };

  if (!canWatch) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-900/20 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold">Video Locked</h3>
        <p className="mt-1 text-sm text-gray-400">
          Complete the previous video to unlock this one
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {/* YouTube IFrame API injects its iframe into this host element. */}
        <div ref={hostRef} className="h-full w-full" />

        {/* Buffering overlay */}
        {isBuffering && !error && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-customTeal"></div>
              <p className="text-sm text-white">Loading video...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <svg
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-white">Video Error</h3>
                <p className="mt-2 text-sm text-gray-300">{error}</p>
              </div>
              <Button onClick={handleRetry} className="mt-2">
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Progress: {Math.round(progress)}%</span>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Watch Progress */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-customTeal via-customBlue-100 to-customViolet-100 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Indicators */}
      {isBuffering && !error && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-yellow-900/20 border border-yellow-500 p-3 text-yellow-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent"></div>
          <span className="text-sm font-medium">Buffering video...</span>
        </div>
      )}

      {hasWatched && !error && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-900/20 border border-green-500 p-3 text-green-400">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">Video completed!</span>
        </div>
      )}
    </div>
  );
}
