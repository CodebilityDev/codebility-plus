"use client";

import { useEffect, useState } from "react";
import { Paperclip, X, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { TiptapEditor } from "./TiptapEditor";
import type { HelpTicketAttachmentRow } from "../actions";

export type NewQuestionValues = {
  title: string;
  description: string; // HTML from Tiptap
  tags: string[];
  attachments: File[]; // newly added files to upload
  removedAttachmentIds: string[]; // existing attachments to delete on save
};

export type EditQuestionValues = {
  title: string;
  description: string;
  tags: string[];
  attachments: HelpTicketAttachmentRow[]; // already-uploaded attachments
};

type NewQuestionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: NewQuestionValues) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  initialValues?: EditQuestionValues;
};

function isEmptyHtml(html: string) {
  return !html || html.replace(/<[^>]*>/g, "").trim().length === 0;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function NewQuestionModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  mode = "create",
  initialValues,
}: NewQuestionModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [editorKey, setEditorKey] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Existing (already-uploaded) attachments shown in edit mode, minus any
  // the user has marked for removal.
  const [existingAttachments, setExistingAttachments] = useState<HelpTicketAttachmentRow[]>(
    initialValues?.attachments ?? []
  );
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setTitle(initialValues?.title ?? "");
      setDescription(initialValues?.description ?? "");
      setTags(initialValues?.tags ?? []);
      setAttachments([]);
      setExistingAttachments(initialValues?.attachments ?? []);
      setRemovedAttachmentIds([]);
      setEditorKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  const isValid = title.trim() && !isEmptyHtml(description);
  const isEdit = mode === "edit";

  function addTag() {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setAttachments([...attachments, ...Array.from(files)]);
  }

  function removeAttachment(index: number) {
    setAttachments(attachments.filter((_, i) => i !== index));
  }

  function removeExistingAttachment(id: string) {
    setExistingAttachments(existingAttachments.filter((a) => a.id !== id));
    setRemovedAttachmentIds([...removedAttachmentIds, id]);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditorKey((k) => k + 1);
    setTags([]);
    setTagInput("");
    setAttachments([]);
    setExistingAttachments([]);
    setRemovedAttachmentIds([]);
  }

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({ title: title.trim(), description, tags, attachments, removedAttachmentIds });
  }

  function handleOpenChange(next: boolean) {
    if (!next && mode === "create") resetForm();
    onOpenChange(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <DialogTitle className="text-lg">
            {isEdit ? "Edit question" : "Ask a question"}
          </DialogTitle>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {isEdit
              ? "Update your question below."
              : "Post to the community and get help from other devs or an admin."}
          </p>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="question-title">Title</Label>
            <Input
              id="question-title"
              placeholder="e.g. How do I move a task between sprints?"
              className="border-slate-200 focus-visible:ring-indigo-200 dark:border-slate-700 dark:focus-visible:ring-indigo-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <TiptapEditor
              key={editorKey}
              value={description}
              onChange={setDescription}
              placeholder="Add any details that would help others answer this."
              size="roomy"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="question-tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="question-tags"
                placeholder="Press enter to add a tag"
                className="border-slate-200 focus-visible:ring-indigo-200 dark:border-slate-700 dark:focus-visible:ring-indigo-900"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="shrink-0 border-slate-200 dark:border-slate-700"
                onClick={addTag}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                      className="text-indigo-400 hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-indigo-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="question-attachments">Attachments</Label>
            <label
              htmlFor="question-attachments"
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-200 p-3 text-sm text-slate-400 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-500 dark:hover:border-indigo-800 dark:hover:text-indigo-400"
            >
              <Paperclip className="h-4 w-4" />
              Click to attach files
            </label>
            <input
              id="question-attachments"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Existing attachments (edit mode only) */}
            {existingAttachments.length > 0 && (
              <ul className="space-y-1.5 pt-1">
                {existingAttachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                      <span className="truncate">{att.file_name}</span>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {att.file_size ? formatFileSize(att.file_size) : ""}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExistingAttachment(att.id)}
                      aria-label={`Remove ${att.file_name}`}
                      className="shrink-0 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Newly added, not-yet-uploaded attachments */}
            {attachments.length > 0 && (
              <ul className="space-y-1.5 pt-1">
                {attachments.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/60"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                      <span className="truncate">{file.name}</span>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {formatFileSize(file.size)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      aria-label={`Remove ${file.name}`}
                      className="shrink-0 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row dark:border-slate-800">
          <Button
            variant="outline"
            className="w-full border-slate-200 sm:w-auto dark:border-slate-700"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting
              ? isEdit
                ? "Saving..."
                : "Posting..."
              : isEdit
                ? "Save changes"
                : "Submit question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}