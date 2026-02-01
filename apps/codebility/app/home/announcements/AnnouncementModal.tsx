"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Edit, ChevronLeft } from "lucide-react";
import { AnnouncementTab } from "./AnnouncementTab";
import { AnnouncementContent } from "./AnnouncementContent";
import { AnnouncementEditor } from "./AnnouncementEditor";
import { announcementTabs } from "./data";
import { AnnouncementCategory, AnnouncementPage } from "./types";
import { createClientClientComponent } from "@/utils/supabase/client";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<AnnouncementCategory>("whats-new");
  const [mounted, setMounted] = useState(false);
  const [pages, setPages] = useState<AnnouncementPage[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const supabase = createClientClientComponent();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch announcements from database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!isOpen) return;
      if (!supabase) throw new Error("Supabase client not initialized");

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("announcements")
          .select("*")
          .order("category");

        if (fetchError) throw fetchError;

        const mappedData: AnnouncementPage[] = (data || []).map((item) => ({
          category: item.category as AnnouncementCategory,
          title: item.title,
          banner_image: item.banner_image,
          content: item.content,
          last_updated: item.updated_at || item.created_at,
        }));

        setPages(mappedData);
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
  }, [isOpen, supabase]);

  // Reset sidebar visibility when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // On mobile, start with sidebar visible
      const isMobile = window.innerWidth < 768;
      setShowSidebar(isMobile ? true : true);
    }
  }, [isOpen]);

  // Get content for active tab
  const activeContent = pages.find((page) => page.category === activeTab);
  if (!supabase) throw new Error("Supabase client not initialized");

  const handleSave = async (updatedPage: AnnouncementPage) => {
    try {
      setPages((prevPages) =>
        prevPages.map((page) =>
          page.category === updatedPage.category ? updatedPage : page
        )
      );

      // Upsert to database (insert or update)
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
          {
            onConflict: "category",
          }
        )
        .select()
        .single();

      if (upsertError) throw upsertError;

      console.log("Successfully saved announcement:", data);

      setPages((prevPages) =>
        prevPages.map((page) =>
          page.category === updatedPage.category
            ? {
                category: data.category,
                title: data.title,
                banner_image: data.banner_image,
                content: data.content,
                last_updated: data.updated_at || data.created_at,
              }
            : page
        )
      );
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError("Failed to save announcement");
    }
  };

  const handleTabClick = (category: AnnouncementCategory) => {
    setActiveTab(category);
    // On mobile, hide sidebar after selecting a tab
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
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
          {/* Left Sidebar - Tabs */}
          <div
            className={`
              ${showSidebar ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
              fixed md:relative inset-y-0 left-0 z-10
              w-full sm:w-80 md:w-80
              border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950
              transition-transform duration-300 ease-in-out
            `}
          >
            {/* Header */}
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

            {/* Tabs */}
            <div className="space-y-2 p-4 sm:p-6" role="tablist">
              {announcementTabs.map((tab) => (
                <AnnouncementTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={handleTabClick}
                />
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Header with Close and Edit Buttons */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 md:p-8 dark:border-gray-800 gap-2">
              {/* Back button for mobile */}
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 flex-shrink-0"
                aria-label="Back to categories"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 min-w-0">
                {announcementTabs.find((tab) => tab.id === activeTab)?.label}
              </h3>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditorOpen(true)}
                  disabled={loading}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Edit announcement"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  aria-label="Close announcement modal"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                  <div className="text-center px-4">
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                      No content available for this section yet.
                    </p>
                  </div>
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