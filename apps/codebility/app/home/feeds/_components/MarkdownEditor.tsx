"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownEditor({
  initialValue = "",
  onChange,
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (onChange) onChange(value);
  }, [value, onChange]);

  useEffect(() => {
    // Auto-resize textarea for nicer UX
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = Math.min(ta.scrollHeight, 800) + "px"; // limit max-height
  }, [value, tab]);

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-4 shadow dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-1 rounded-md bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`rounded-md px-4 py-1 text-sm font-medium ${tab === "write" ? "bg-white shadow dark:bg-gray-700" : "text-gray-600 dark:text-gray-300"}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded-md px-4 py-1 text-sm font-medium ${tab === "preview" ? "bg-white shadow dark:bg-gray-700" : "text-gray-600 dark:text-gray-300"}`}
          >
            Preview
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Markdown Editor
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        {tab === "write" ? (
          <div className="p-4">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="# Start typing markdown..."
              className="max-h-[600px] min-h-[160px] w-full resize-none bg-transparent text-sm leading-relaxed text-gray-900 outline-none dark:text-gray-100"
            />
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-h-[600px] min-h-[160px] max-w-none overflow-y-auto p-4 text-sm">
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <div className="text-gray-500">
                Nothing to preview — start writing markdown in the{" "}
                <strong>Write</strong> tab.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div>Characters: {value.length}</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setValue("");
              setTab("write");
            }}
            className="rounded-md bg-red-50 px-3 py-1 text-red-600 dark:bg-red-900/30 dark:text-red-300"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setTab(tab === "write" ? "preview" : "write")}
            className="rounded-md bg-gray-50 px-3 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {tab === "write" ? "Show Preview" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
