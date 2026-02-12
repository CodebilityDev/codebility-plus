"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";
import { toast } from "sonner";

interface ShareSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  surveyTitle: string;
}

export default function ShareSurveyModal({
  isOpen,
  onClose,
  surveyId,
  surveyTitle,
}: ShareSurveyModalProps) {
  const [copied, setCopied] = useState(false);

  // Build the public survey URL - uses window.location.origin safely (SSR guard)
  const surveyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/surveys/${surveyId}`;

  // Copy URL to clipboard and show feedback for 2 seconds
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      toast.success("Survey link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Share2 className="h-5 w-5 text-violet-600" />
            Share Survey
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Share this survey with others using the link below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Survey title preview */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {surveyTitle}
            </p>
          </div>

          {/* URL input + copy button */}
          <div className="flex items-center gap-2">
            <Input
              value={surveyUrl}
              readOnly
              // Clicking the input auto-selects the URL for easy copy
              onClick={(e) => e.currentTarget.select()}
              className="flex-1 rounded border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <Button
              type="button"
              variant={copied ? "default" : "outline"}
              size="sm"
              onClick={handleCopy}
              className={`min-w-[5rem] rounded ${
                copied
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Info note */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Anyone with this link can access and respond to the survey.
            </p>
          </div>
        </div>

        {/* Footer close */}
        <div className="flex justify-end border-t border-gray-200 pt-2 dark:border-gray-700">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}