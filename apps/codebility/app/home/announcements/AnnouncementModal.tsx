"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Edit, ChevronLeft, Plus, Check, Trash2 } from "lucide-react";
import { AnnouncementTab } from "./AnnouncementTab";
import { AnnouncementContent } from "./AnnouncementContent";
import { AnnouncementEditor } from "./AnnouncementEditor";
import { AnnouncementCategory, AnnouncementPage, AnnouncementTab as TabType } from "./types";
import { createClientClientComponent } from "@/utils/supabase/client";
import { slugToLabel, labelToSlug } from "./utils";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AnnouncementCategory>("");
  const [mounted, setMounted] = useState(false);
  const [pages, setPages] = useState<AnnouncementPage[]>([]);
  const [tabs, setTabs] = useState<TabType[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Category management state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: string; label: string } | null>(null);
  const [categoryActionLoading, setCategoryActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const supabase = createClientClientComponent();

  const [isAdmin, setIsAdmin] = useState(false);

// Add this useEffect alongside your existing ones
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!supabase || !isOpen) return;

      try {
        // Get current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
      
        if (!user) return;

        // Find the codev record matching the auth user
        const { data: codevData, error: codevError } = await supabase
          .from("codev")
          .select("id")
          .eq("id", user.id)
          .single();

        if (codevError || !codevData) return;
        
        // Check if the codev id exists in admin_users
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", codevData.id)
          .single();

        if (adminError || !adminData) return;

        setIsAdmin(true);
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };

    checkAdminStatus();
  }, [isOpen, supabase]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch announcements from database
  useEffect(() => {
    const fetchAnnouncements = async () => {
       if (!isOpen || !supabase) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at");

        if (fetchError) throw fetchError;

        const mappedData: AnnouncementPage[] = (data || []).map((item) => ({
          id: item.id,
          category: item.category as AnnouncementCategory,
          title: item.title,
          banner_image: item.banner_image,
          content: item.content,
          last_updated: item.updated_at || item.created_at,
        }));

        setPages(mappedData);

        // Build tabs from DB rows
        const derivedTabs: TabType[] = mappedData.map((p) => ({
          id: p.category,
          label: slugToLabel(p.category),
        }));
        setTabs(derivedTabs);

        if (derivedTabs.length > 0 && !activeTab) {
          setActiveTab(derivedTabs[0]?.id ?? "");
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError(
          `Failed to load announcements: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowSidebar(true);
    }
  }, [isOpen]);

  const activeContent = pages.find((page) => page.category === activeTab);
  if (!supabase) throw new Error("Supabase client not initialized");

  // ── Save existing page content ──────────────────────────────────────────
  const handleSave = async (updatedPage: AnnouncementPage) => {
    if (!supabase || !isAdmin) return;
    try {
      setPages((prev) =>
        prev.map((p) => (p.category === updatedPage.category ? updatedPage : p))
      );

      const { data, error: upsertError } = await supabase
        .from("announcements")
        .upsert(
          {
            category: updatedPage.category,
            title: updatedPage.title,
            banner_image: updatedPage.banner_image,
            content: updatedPage.content,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "category" }
        )
        .select()
        .single();

      if (upsertError) throw upsertError;

      setPages((prev) =>
        prev.map((p) =>
          p.category === updatedPage.category
            ? {
                id: data.id,
                category: data.category,
                title: data.title,
                banner_image: data.banner_image,
                content: data.content,
                last_updated: data.updated_at || data.created_at,
              }
            : p
        )
      );

      const { data: { user } } = await supabase.auth.getUser();
      await supabase.rpc("broadcast_announcement_notification", {
        p_title: "Announcement Updated",
        p_message: `"${updatedPage.title}" has been updated.`,
        p_sender_id: user?.id,
        p_action_url: "/home",
      });
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError("Failed to save announcement");
    }
  };

  // ── Add new category ────────────────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!supabase || !isAdmin) return;
    const label = newCategoryLabel.trim();
    if (!label) return;

    const slug = labelToSlug(label);

    if (tabs.some((t) => t.id === slug)) {
      setError("A category with that name already exists.");
      return;
    }

    try {
      setCategoryActionLoading(true);

      const { data, error: insertError } = await supabase
        .from("announcements")
        .insert({
          category: slug,
          title: label,
          banner_image: "",
          content: "",
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const newPage: AnnouncementPage = {
        id: data.id,
        category: data.category,
        title: data.title,
        banner_image: data.banner_image ?? "",
        content: data.content ?? "",
        last_updated: data.updated_at || data.created_at,
      };

      setPages((prev) => [...prev, newPage]);
      setTabs((prev) => [...prev, { id: slug, label }]);
      setActiveTab(slug);
      setNewCategoryLabel("");
      setIsAddingCategory(false);
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category");
    } finally {
      setCategoryActionLoading(false);
    }
  };

  // ── Rename category ─────────────────────────────────────────────────────
  const handleRenameCategory = async () => {
    if (!supabase || !isAdmin) return;
    if (!editingCategory) return;
    const label = editingCategory.label.trim();
    if (!label) return;

    const newSlug = labelToSlug(label);
    const oldSlug = editingCategory.id;

    // No change
    if (newSlug === oldSlug && label === slugToLabel(oldSlug)) {
      setEditingCategory(null);
      return;
    }

    try {
      setCategoryActionLoading(true);

      // Update the category slug in DB
      const { error: updateError } = await supabase
        .from("announcements")
        .update({ category: newSlug, updated_at: new Date().toISOString() })
        .eq("category", oldSlug);

      if (updateError) throw updateError;

      setPages((prev) =>
        prev.map((p) =>
          p.category === oldSlug ? { ...p, category: newSlug } : p
        )
      );
      setTabs((prev) =>
        prev.map((t) =>
          t.id === oldSlug ? { id: newSlug, label } : t
        )
      );
      if (activeTab === oldSlug) setActiveTab(newSlug);
      setEditingCategory(null);
    } catch (err) {
      console.error("Error renaming category:", err);
      setError("Failed to rename category");
    } finally {
      setCategoryActionLoading(false);
    }
  };

  // ── Delete category ─────────────────────────────────────────────────────
  const handleDeleteCategory = async (categoryId: string) => {
    if (!supabase || !isAdmin) return;
    try {
      setCategoryActionLoading(true);

      const { error: deleteError } = await supabase
        .from("announcements")
        .delete()
        .eq("category", categoryId);

      if (deleteError) throw deleteError;

      const remainingTabs = tabs.filter((t) => t.id !== categoryId);
      setTabs(remainingTabs);
      setPages((prev) => prev.filter((p) => p.category !== categoryId));
      setDeleteConfirm(null);

      if (activeTab === categoryId) {
        setActiveTab(remainingTabs[0]?.id ?? "");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
    } finally {
      setCategoryActionLoading(false);
    }
  };

  const handleTabClick = (category: AnnouncementCategory) => {
    setActiveTab(category);
    setEditingCategory(null);
    setIsAddingCategory(false);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-modal-title"
      >
        <div className="flex h-full sm:h-[850px] sm:max-h-[95vh] w-full max-w-screen-2xl overflow-hidden rounded-none sm:rounded-xl bg-white shadow-2xl dark:bg-gray-900 pointer-events-auto">

          {/* ── Left Sidebar ─────────────────────────────────────── */}
          <div
            className={`
              ${showSidebar ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
              fixed md:relative inset-y-0 left-0 z-10
              w-full sm:w-80 md:w-80
              border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950
              transition-transform duration-300 ease-in-out
              flex flex-col
            `}
          >
            {/* Sidebar Header */}
            <div className="border-b border-gray-200 p-4 sm:p-6 md:p-8 dark:border-gray-800">
              <h2
                id="announcement-modal-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
              >
                Codebility
              </h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                News & Updates
              </p>
            </div>

            {/* Tabs List */}
            <div className="flex-1 overflow-y-auto space-y-1 p-4 sm:p-6" role="tablist">
              {tabs.map((tab) => (
                <div key={tab.id}>
                  {/* Rename inline editor */}
                  {editingCategory?.id === tab.id ? (
                    <div className="flex items-center gap-1 px-2 py-1">
                      <input
                        autoFocus
                        value={editingCategory.label}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, label: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameCategory();
                          if (e.key === "Escape") setEditingCategory(null);
                        }}
                        className="flex-1 text-sm rounded border border-blue-400 px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        placeholder="Category name"
                      />
                      <button
                        onClick={handleRenameCategory}
                        disabled={categoryActionLoading}
                        className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        title="Confirm rename"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : deleteConfirm === tab.id ? (
                    /* Delete confirmation inline */
                    <div className="flex flex-col gap-1 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                        Delete "{tab.label}"? This cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteCategory(tab.id)}
                          disabled={categoryActionLoading}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <AnnouncementTab
                      id={tab.id}
                      label={tab.label}
                      isActive={activeTab === tab.id}
                      isAdmin={isAdmin}
                      onClick={handleTabClick}
                      onEdit={(id, label) => setEditingCategory({ id, label })}
                      onDelete={(id) => setDeleteConfirm(id)}
                    />
                  )}
                </div>
              ))}

              {/* Add Category */}
              {isAdmin && (
                isAddingCategory ? (
                <div className="flex items-center gap-1 px-2 py-1 mt-2">
                  <input
                    autoFocus
                    value={newCategoryLabel}
                    onChange={(e) => setNewCategoryLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCategory();
                      if (e.key === "Escape") {
                        setIsAddingCategory(false);
                        setNewCategoryLabel("");
                      }
                    }}
                    className="flex-1 text-sm rounded border border-blue-400 px-2 py-1 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    placeholder="Category name"
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={categoryActionLoading || !newCategoryLabel.trim()}
                    className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    title="Add category"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryLabel("");
                    }}
                    className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                    title="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) :(
                <button
                  onClick={() => setIsAddingCategory(true)}
                  className="flex items-center gap-2 w-full mt-2 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </button>
               )
              )}
            </div>
          </div>

          {/* ── Right Content Area ───────────────────────────────── */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 md:p-8 dark:border-gray-800 gap-2">
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 flex-shrink-0"
                aria-label="Back to categories"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 min-w-0">
                {tabs.find((tab) => tab.id === activeTab)?.label ?? ""}
              </h3>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {isAdmin && (
                  <button
                    onClick={() => setIsEditorOpen(true)}
                    disabled={loading || !activeContent}
                    className="flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Edit announcement"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  aria-label="Close announcement modal"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      Loading announcements...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center px-4">
                    <p className="text-sm sm:text-base text-red-500 dark:text-red-400 mb-2">
                      {error}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs sm:text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : activeContent ? (
                <AnnouncementContent page={activeContent} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    No content available for this section yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {activeContent && (
        <AnnouncementEditor
          page={activeContent}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );

  return createPortal(modalContent, document.body);
};