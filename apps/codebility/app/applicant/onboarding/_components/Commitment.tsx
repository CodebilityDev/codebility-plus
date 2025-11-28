"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@codevs/ui/checkbox";

interface CommitmentProps {
  userName: string;
  onComplete: (signature: string, canDoMobile: boolean) => void;
}

export default function Commitment({ userName, onComplete }: CommitmentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [canDoMobile, setCanDoMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set drawing style
    ctx.strokeStyle = "#3b82f6"; // blue-500
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleComplete = () => {
    const canvas = canvasRef.current;
    if (!canvas || canDoMobile === null) return;

    const signatureData = canvas.toDataURL("image/png");
    onComplete(signatureData, canDoMobile);
  };

  const canSubmit = hasSignature && acknowledged && isReady && canDoMobile !== null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-4 text-3xl font-bold">Commitment Agreement</h2>
        <p className="text-gray-400">
          Please read carefully and acknowledge your understanding
        </p>
      </div>

      {/* Commitment Statement */}
      <div className="rounded-lg border-2 border-yellow-500 bg-yellow-900/10 p-6">
        <h3 className="mb-4 text-xl font-semibold text-yellow-400">
          ⚠️ Important: Please Take Your Time
        </h3>

        <div className="space-y-4 text-gray-300">
          <p>
            Dear <span className="font-semibold">{userName}</span>,
          </p>

          <p>
            <span className="font-bold text-white">
              Take a few days to think this through.
            </span>{" "}
            This is not a decision to rush. We want to ensure you're making the right choice
            for yourself and for the team.
          </p>

          <div className="my-4 space-y-3 rounded-lg bg-black-100 p-4">
            <p className="font-semibold text-white">By joining Codebility, you commit to:</p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>
                <span className="font-bold text-white">Minimum 3-6 months commitment</span> to
                your assigned projects
              </li>
              <li>Consistent availability and dedication to your team</li>
              <li>Proactive communication about blockers and issues</li>
              <li>Continuous learning and professional growth</li>
              <li>Adhering to our code quality standards and best practices</li>
              <li>Participating actively in team meetings and code reviews</li>
            </ul>
          </div>

          <p>
            <span className="font-bold text-white">
              This commitment is crucial for project success.
            </span>{" "}
            Leaving early or being inconsistent affects the entire team and clients who depend
            on us. We invest time and resources in onboarding you, and we want to ensure it's
            not wasted.
          </p>

          <p>
            <span className="font-bold text-white">If you have any doubts, please don't proceed yet.</span>{" "}
            Take the time you need to be absolutely certain. We'd rather you be 100% committed
            than rush into something you're unsure about.
          </p>

          <p className="text-yellow-400">
            Only proceed when you are ready to fully commit to this journey with Codebility.
          </p>
        </div>
      </div>

      {/* Acknowledgment Checkboxes */}
      <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-900/20 p-6">
        <h3 className="mb-4 text-lg font-semibold">I acknowledge that:</h3>

        <div className="flex items-start gap-3">
          <Checkbox
            id="acknowledge"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
            className="mt-1 h-5 w-5"
          />
          <label htmlFor="acknowledge" className="cursor-pointer text-sm text-gray-300">
            I have read and understood the commitment requirements, including the minimum 3-6
            months commitment to my assigned projects.
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="ready"
            checked={isReady}
            onCheckedChange={(checked) => setIsReady(checked as boolean)}
            className="mt-1 h-5 w-5"
          />
          <label htmlFor="ready" className="cursor-pointer text-sm text-gray-300">
            I have taken time to think this through and I am ready to fully commit to joining
            Codebility with dedication and consistency.
          </label>
        </div>
      </div>

      {/* React Native Question */}
      <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-900/20 p-4">
        <div>
          <p className="text-sm font-medium text-gray-200">
            Can you do or are you willing to learn React Native (mobile development)?
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Mobile development is in high demand and we highly prioritize developers who can work on mobile projects.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setCanDoMobile(true)}
            variant={canDoMobile === true ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${
              canDoMobile === true
                ? "from-customTeal to-customViolet-100 bg-gradient-to-r via-customBlue-100"
                : ""
            }`}
          >
            Yes
          </Button>
          <Button
            onClick={() => setCanDoMobile(false)}
            variant={canDoMobile === false ? "default" : "outline"}
            size="sm"
            className={`flex-1 ${
              canDoMobile === false
                ? "from-customTeal to-customViolet-100 bg-gradient-to-r via-customBlue-100"
                : ""
            }`}
          >
            No
          </Button>
        </div>
      </div>

      {/* Signature Box */}
      <div className="space-y-3">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Sign below to confirm your commitment:
          </label>
          <div className="rounded-lg border-2 border-gray-700 bg-white p-2">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="h-40 w-full cursor-crosshair"
              style={{ touchAction: "none" }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Draw your signature above using your mouse or touch screen
            </p>
            <Button
              onClick={clearSignature}
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleComplete}
          disabled={!canSubmit}
          className="from-customTeal to-customViolet-100 bg-gradient-to-r via-customBlue-100 px-12 py-6 text-lg disabled:opacity-50"
        >
          I'm Ready to Join Codebility
        </Button>
      </div>

      {!canSubmit && (
        <p className="text-center text-sm text-gray-400">
          {!acknowledged || !isReady
            ? "Please check both acknowledgment boxes above"
            : canDoMobile === null
              ? "Please answer the React Native question above"
              : "Please sign in the box above to continue"}
        </p>
      )}
    </div>
  );
}
