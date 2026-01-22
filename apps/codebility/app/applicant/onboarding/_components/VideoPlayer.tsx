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
  
  // Use ref to track if we've already saved progress
  const progressSavedRef = useRef(false);

  const saveVideoProgress = async () => {
    const video = videoRef.current;
    if (!video || progressSavedRef.current) return;

    progressSavedRef.current = true;

    await updateVideoProgress({
      applicantId,
      videoNumber,
      watchedDuration: video.currentTime,
      totalDuration: video.duration,
      completed: true,
    });

    // Notify parent component to refresh progress state (to unlock Next button)
    onVideoComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const percentWatched = (video.currentTime / video.duration) * 100;
      setProgress(percentWatched);

      // Mark as watched if they've seen 98% or more (to unlock Next button)
      // But don't auto-advance - user must click Next manually
      if (percentWatched >= 98 && !progressSavedRef.current) {
        setHasWatched(true);
        // Save progress in background without triggering navigation
        saveVideoProgress();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []); // Empty dependency array - only set up listeners once

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
          onContextMenu={(e) => e.preventDefault()} // Disable right-click
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Progress: {Math.round(progress)}%</span>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-customTeal via-customBlue-100 to-customViolet-100 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Indicator */}
      {hasWatched && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-900/20 border border-green-500 p-3 text-green-400">
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
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