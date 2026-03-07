"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { FeatureModal } from "../type";
import { createModal, deleteModal, toggleModalActive } from "../actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@codevs/ui/alert-dialog";

interface ModalListClientProps {
  modals: FeatureModal[];
}

export default function ModalListClient({ modals: initial }: ModalListClientProps) {
  const [modals, setModals] = useState<FeatureModal[]>(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const router = useRouter();

  async function handleCreate() {
    setLoadingId("new");
    const { id, error } = await createModal();
    setLoadingId(null);
    if (!error && id) {
      router.push(`/home/promote-modal/${id}`);
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    setLoadingId(deleteTargetId + "-delete");
    const { error } = await deleteModal(deleteTargetId);
    setLoadingId(null);
    if (!error) {
      setModals((prev) => prev.filter((m) => m.id !== deleteTargetId));
    }
    setDeleteTargetId(null);
  }

  async function handleToggle(id: string, current: boolean) {
    setLoadingId(id + "-toggle");
    const { error } = await toggleModalActive(id, !current);
    setLoadingId(null);
    if (!error) {
      setModals((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_active: !current } : m))
      );
    }
  }

  const deleteTarget = modals.find((m) => m.id === deleteTargetId);

  return (
    <>
        <AlertDialog
            open={!!deleteTargetId}
            onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
        >
            <AlertDialogContent className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 dark:text-white">
                    Delete this modal?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                        "{deleteTarget?.headline || "Untitled Modal"}"
                    </span>{" "}
                    will be permanently deleted. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                    Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                    onClick={confirmDelete}
                    className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                    {loadingId === deleteTargetId + "-delete" ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      <div className="space-y-4">
        {/* Add button */}
        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            disabled={loadingId === "new"}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            <Icons.Plus className="h-4 w-4" />
            {loadingId === "new" ? "Creating..." : "Add Modal"}
          </button>
        </div>

        {/* Empty state */}
        {modals.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-16 text-center">
            <Icons.Megaphone className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No promotional modals yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click "Add Modal" to create your first one.</p>
          </div>
        )}

        {/* Modal cards */}
        {modals.map((modal) => (
          <div
            key={modal.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-900 transition-colors hover:border-violet-300 dark:hover:border-violet-700"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20">
              <Icons.Megaphone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {modal.headline || "Untitled Modal"}
                </p>
                {modal.badge && (
                  <span className="rounded-full bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 text-xs text-violet-700 dark:text-violet-300">
                    {modal.badge}
                  </span>
                )}
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  modal.is_active
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${modal.is_active ? "bg-green-500" : "bg-gray-400"}`} />
                  {modal.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                {modal.subheadline || "No description"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
                Created {new Date(modal.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" · "}
                {modal.features?.length ?? 0} feature{modal.features?.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleToggle(modal.id, modal.is_active)}
                disabled={loadingId === modal.id + "-toggle"}
                title={modal.is_active ? "Deactivate" : "Activate"}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                {modal.is_active ? <Icons.EyeOff className="h-4 w-4" /> : <Icons.Eye className="h-4 w-4" />}
              </button>

              <button
                onClick={() => router.push(`/home/promote-modal/${modal.id}`)}
                title="Edit"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 transition-colors"
              >
                <Icons.Pencil className="h-4 w-4" />
              </button>

              <button
                onClick={() => setDeleteTargetId(modal.id)}
                disabled={loadingId === modal.id + "-delete"}
                title="Delete"
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors disabled:opacity-50"
              >
                <Icons.Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}