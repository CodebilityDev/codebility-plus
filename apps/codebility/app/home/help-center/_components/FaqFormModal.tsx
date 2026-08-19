"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";
import { Label } from "@codevs/ui/label";

export type FaqFormValues = {
  category: string;
  question: string;
  answer: string;
};

type FaqFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCategories: string[];
  mode: "add" | "edit";
  initialValues?: FaqFormValues;
  onSubmit: (values: FaqFormValues) => void;
  isSubmitting?: boolean;
};

const emptyValues: FaqFormValues = { category: "", question: "", answer: "" };

export function FaqFormModal({
  open,
  onOpenChange,
  existingCategories,
  mode,
  initialValues,
  onSubmit,
  isSubmitting = false,
}: FaqFormModalProps) {
  const [values, setValues] = useState<FaqFormValues>(initialValues ?? emptyValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues ?? emptyValues);
    }
  }, [open, initialValues]);

  const isValid = values.category.trim() && values.question.trim() && values.answer.trim();

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({
      category: values.category.trim(),
      question: values.question.trim(),
      answer: values.answer.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add FAQ question" : "Edit FAQ question"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="faq-category">Category</Label>
            <Input
              id="faq-category"
              list="faq-category-options"
              placeholder="e.g. Getting Started"
              value={values.category}
              onChange={(e) => setValues((prev) => ({ ...prev, category: e.target.value }))}
            />
            {/* Autocomplete against existing categories, but still allow typing a new one. */}
            <datalist id="faq-category-options">
              {existingCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="faq-question">Question</Label>
            <Input
              id="faq-question"
              placeholder="How do I reset my password?"
              value={values.question}
              onChange={(e) => setValues((prev) => ({ ...prev, question: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="faq-answer">Answer</Label>
            <Textarea
              id="faq-answer"
              rows={4}
              placeholder="Write the answer users will see..."
              value={values.answer}
              onChange={(e) => setValues((prev) => ({ ...prev, answer: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Saving..." : mode === "add" ? "Save question" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}