"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Plus, ChevronsRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getFaqItems,
  createFaqItem,
  updateFaqItem,
  deleteFaqItem,
  type FaqItemRow,
} from "../actions";
import { FaqFormModal, type FaqFormValues } from "./FaqFormModal";
import { FaqDetailModal } from "./FaqDetailModal";
import { ConfirmDialog } from "./ConfirmDialog";

type FaqSectionProps = {
  initialItems: FaqItemRow[];
  isAdmin?: boolean;
  onContactUs?: () => void;
};

export function FaqSection({ initialItems, isAdmin = false, onContactUs }: FaqSectionProps) {
  const [items, setItems] = useState<FaqItemRow[]>(initialItems);
  const [query, setQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | undefined>(
    initialItems[0]?.category
  );
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const [detailItem, setDetailItem] = useState<FaqItemRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formInitialValues, setFormInitialValues] = useState<FaqFormValues | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FaqItemRow | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
    [items]
  );

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, FaqItemRow[]>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [items]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return items.filter((item) => item.question.toLowerCase().includes(q));
  }, [items, query]);

  async function refetch() {
    const { data } = await getFaqItems();
    if (data) setItems(data);
  }

  function openDetail(item: FaqItemRow) {
    setDetailItem(item);
    setIsDetailOpen(true);
  }

  function openAddForm() {
    setFormMode("add");
    setFormInitialValues(undefined);
    setIsFormOpen(true);
  }

  function openEditForm(item: FaqItemRow) {
    setIsDetailOpen(false);
    setFormMode("edit");
    setFormInitialValues({
      category: item.category,
      question: item.question,
      answer: item.answer,
    });
    setIsFormOpen(true);
  }

  function openDeleteConfirm(item: FaqItemRow) {
    setIsDetailOpen(false);
    setDeleteTarget(item);
    setIsDeleteOpen(true);
  }

  function handleFormSubmit(values: FaqFormValues) {
    setActionError(null);
    startTransition(async () => {
      const result =
        formMode === "add"
          ? await createFaqItem(values)
          : await updateFaqItem({ id: detailItem!.id, ...values });

      if (result.error) {
        setActionError(result.error);
        return;
      }
      setIsFormOpen(false);
      await refetch();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteFaqItem(deleteTarget.id);
      if (result.error) {
        setActionError(result.error);
        return;
      }
      setDeleteTarget(null);
      await refetch();
    });
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-1 flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-800 sm:text-xl dark:text-slate-100">
          Search for a question
        </h2>
        {isAdmin && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
            onClick={openAddForm}
            aria-label="Add FAQ question"
          >
            +
          </Button>
        )}
      </div>
      <p className="mb-4 text-sm text-slate-400 dark:text-slate-500">
        Type your question or search keyword
      </p>

      {actionError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {actionError}
        </p>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 dark:text-slate-600" />
        <Input
          placeholder="Start typing..."
          className="border-slate-200 bg-slate-50 pl-9 focus-visible:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:focus-visible:ring-indigo-900"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {searchResults ? (
          searchResults.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              No questions match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            searchResults.map((item) => (
              <FaqQuestionRow key={item.id} question={item.question} onClick={() => openDetail(item)} />
            ))
          )
        ) : categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
            No FAQ questions yet.
          </p>
        ) : (
          categories.map((category) => {
            const isCategoryOpen = openCategory === category;
            const categoryItems = groupedByCategory.get(category) ?? [];
            return (
              <div key={category}>
                <button
                  type="button"
                  onClick={() => setOpenCategory(isCategoryOpen ? undefined : category)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    isCategoryOpen
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {category}
                  {isCategoryOpen && <ChevronsRight className="h-4 w-4" />}
                </button>

                {isCategoryOpen && (
                  <div className="space-y-0.5 pb-1 pt-1">
                    {categoryItems.map((item) => (
                      <FaqQuestionRow key={item.id} question={item.question} onClick={() => openDetail(item)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 rounded-xl bg-indigo-600 p-4 text-white dark:bg-indigo-500">
        <p className="font-semibold">Do you still need help?</p>
        <p className="mb-3 text-sm text-indigo-100">Send your request via email</p>
        <Button size="sm" className="gap-1.5 bg-white text-indigo-600 hover:bg-indigo-50" onClick={onContactUs}>
          <Mail className="h-3.5 w-3.5" />
          Contact us
        </Button>
      </div>

      <FaqDetailModal
        item={detailItem}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        isAdmin={isAdmin}
        onEdit={openEditForm}
        onDelete={openDeleteConfirm}
      />

      {isAdmin && (
        <>
          <FaqFormModal
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            existingCategories={categories}
            mode={formMode}
            initialValues={formInitialValues}
            onSubmit={handleFormSubmit}
            isSubmitting={isPending}
          />

          <ConfirmDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            title="Delete this question?"
            description={`"${deleteTarget?.question ?? ""}" will be permanently removed.`}
            confirmLabel={isPending ? "Deleting..." : "Delete"}
            onConfirm={handleDelete}
          />
        </>
      )}
    </section>
  );
}

function FaqQuestionRow({ question, onClick }: { question: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
    >
      {question}
    </button>
  );
}