"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TiptapEditor } from "./TiptapEditor";

type CommentEditorProps = {
  onSubmit: (html: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  initialValue?: string;
};

export function CommentEditor({
  onSubmit,
  onCancel,
  placeholder = "Write a reply...",
  submitLabel = "Reply",
  isSubmitting = false,
  initialValue = "",
}: CommentEditorProps) {
  const [html, setHtml] = useState(initialValue);
  const [key, setKey] = useState(0);

  function isEmpty(value: string) {
    return !value || value.replace(/<[^>]*>/g, "").trim().length === 0;
  }

  function handleSubmit() {
    if (isEmpty(html) || isSubmitting) return;
    onSubmit(html);
    if (!onCancel) {
      // Only auto-clear for "new comment" usage. Editing closes/unmounts instead.
      setHtml("");
      setKey((k) => k + 1);
    }
  }

  return (
    <div className="space-y-2">
      <TiptapEditor key={key} value={html} onChange={setHtml} placeholder={placeholder} size="compact" />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            size="sm"
            variant="outline"
            className="border-slate-200 dark:border-slate-700"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}