"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateVideoProgress } from "../_service/action";

interface VideoPlayerProps {
  videoNumber: number;
  videoUrl: string;
  applicantId: string;
  onVideoComplete: () => void;
  canWatch: boolean;
}

export default function VideoPlayer({
  videoNumber,
  videoUrl,
  applicantId,
  onVideoComplete,
  canWatch,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasWatched, setHasWatched] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const progressSavedRef = useRef(false);

  const saveVideoProgress = async () => {
    const video = videoRef.current;
    if (!video || progressSavedRef.current) return;

    progressSavedRef.current = true;

    try {
      await updateVideoProgress({
        applicantId,
        videoNumber,
        watchedDuration: video.currentTime,
        totalDuration: video.duration,
        completed: true,
      });
      onVideoComplete();
    } catch (err) {
      console.error("Failed to save progress:", err);
      // Reset so user can try again
      progressSavedRef.current = false;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const percentWatched = (video.currentTime / video.duration) * 100;
      setProgress(percentWatched);

      if (percentWatched >= 98 && !progressSavedRef.current) {
        setHasWatched(true);
        saveVideoProgress();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setError(null);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };

    const handlePause = () => setIsPlaying(false);

    // NEW: Buffering detection
    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    // NEW: Error handling
    const handleError = () => {
      setError("Failed to load video. Please refresh the page or try again later.");
      setIsBuffering(false);
    };

    // NEW: Track loading progress
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const loadPercent = (bufferedEnd / video.duration) * 100;
        setLoadProgress(loadPercent);
      }
    };

    // NEW: Stalled detection (when download has stopped)
    const handleStalled = () => {
      console.warn("Video download stalled");
      setIsBuffering(true);
    };

    const handleSuspend = () => {
      // Browser stopped fetching media data
      console.log("Video loading suspended");
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("suspend", handleSuspend);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("suspend", handleSuspend);
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRetry = () => {
    setError(null);
    setIsBuffering(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
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
        <video
          ref={videoRef}
          className="h-full w-full"
          controls
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          preload="auto" // NEW: Start loading immediately
          playsInline // NEW: Better mobile support
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* NEW: Buffering overlay */}
        {isBuffering && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-customTeal"></div>
              <p className="text-sm text-white">Loading video...</p>
              {loadProgress > 0 && loadProgress < 100 && (
                <p className="text-xs text-gray-400">
                  {Math.round(loadProgress)}% buffered
                </p>
              )}
            </div>
          </div>
        )}

        {/* NEW: Error overlay */}
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

        {/* NEW: Buffer Progress (shows how much has loaded) */}
        {loadProgress > 0 && loadProgress < 100 && (
          <div className="space-y-1">
            <span className="text-xs text-gray-500">
              Buffered: {Math.round(loadProgress)}%
            </span>
            <div className="h-1 w-full overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-gray-600 transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}
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