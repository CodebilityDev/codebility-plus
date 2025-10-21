"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@codevs/ui/button";
import { H1 } from "@/components/shared/dashboard";
import PageContainer from "../../_components/PageContainer";
import NewsBannerForm from "./_components/NewsBannerForm";
import { createClientClientComponent } from "@/utils/supabase/client";
import { toast } from "sonner";

interface NewsBanner {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "announcement";
  image_url?: string;
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
  created_at: string;
}

const typeColors = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  announcement: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
};

export default function NewsBannersPage() {
  const [banners, setBanners] = useState<NewsBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<NewsBanner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const supabase = createClientClientComponent();
    
    const { data, error } = await supabase
      .from("news_banners")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  const toggleBannerStatus = async (banner: NewsBanner) => {
    const supabase = createClientClientComponent();
    
    const { error } = await supabase
      .from("news_banners")
      .update({ is_active: !banner.is_active, updated_at: new Date().toISOString() })
      .eq("id", banner.id);

    if (error) {
      toast.error("Failed to update banner status");
    } else {
      toast.success(`Banner ${!banner.is_active ? "activated" : "deactivated"}`);
      fetchBanners();
    }
  };

  const deleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    const supabase = createClientClientComponent();
    
    const { error } = await supabase
      .from("news_banners")
      .delete()
      .eq("id", bannerId);

    if (error) {
      toast.error("Failed to delete banner");
    } else {
      toast.success("Banner deleted successfully");
      fetchBanners();
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBanner(null);
    fetchBanners();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
            <span className="text-xl">📢</span>
          </div>
          <div>
            <H1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              News Banners
            </H1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage announcements and notifications for the home page
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      {(showForm || editingBanner) && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm">
                  {editingBanner ? "✏️" : "➕"}
                </span>
              </div>
              <h2 className="text-lg font-semibold">
                {editingBanner ? "Edit Banner" : "Create New Banner"}
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setEditingBanner(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </Button>
          </div>
          <NewsBannerForm
            banner={editingBanner}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      <div className="space-y-4">
        {banners.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl">📢</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No banners yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create your first banner to start showing announcements on the home page
                </p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Banner
              </Button>
            </div>
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* Banner Image Preview */}
                  {banner.image_url && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-300">{banner.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        typeColors[banner.type]
                      }`}
                    >
                      {banner.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        banner.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200"
                      }`}
                    >
                      {banner.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Priority: {banner.priority}
                    </span>
                  </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {banner.message}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div>Created: {formatDate(banner.start_date)}</div>
                      {banner.end_date && (
                        <div>Expires: {formatDate(banner.end_date)}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBannerStatus(banner)}
                    title={banner.is_active ? "Deactivate" : "Activate"}
                    className={`${
                      banner.is_active 
                        ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20" 
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {banner.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingBanner(banner)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Edit banner"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBanner(banner.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete banner"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageContainer>
  );
}