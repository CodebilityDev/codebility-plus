"use client";

import { useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle, XCircle, Megaphone } from "lucide-react";
import { createClientClientComponent } from "@/utils/supabase/client";

type BannerType = "info" | "warning" | "success" | "error" | "announcement";

interface NewsBanner {
  id: string;
  title: string;
  message: string;
  type: BannerType;
  image_url?: string;
  is_active: boolean;
  priority: number;
  start_date: string;
  end_date?: string;
}

const bannerIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  announcement: Megaphone,
};

const bannerStyles = {
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
  success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  announcement: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200",
};

export default function NewsBanner() {
  const [banners, setBanners] = useState<NewsBanner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveBanners();
    
    // Load dismissed banners from localStorage
    const dismissed = localStorage.getItem("dismissedBanners");
    if (dismissed) {
      setDismissedBanners(new Set(JSON.parse(dismissed)));
    }
  }, []);

  const fetchActiveBanners = async () => {
    try {
      const supabase = createClientClientComponent();
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("news_banners")
        .select("*")
        .eq("is_active", true)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .lte("start_date", now)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching banners:", error.message);
        setBanners([]);
      } else {
        setBanners(data || []);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const dismissBanner = (bannerId: string) => {
    const newDismissed = new Set(dismissedBanners);
    newDismissed.add(bannerId);
    setDismissedBanners(newDismissed);
    localStorage.setItem("dismissedBanners", JSON.stringify([...newDismissed]));
  };

  const visibleBanners = banners.filter(banner => !dismissedBanners.has(banner.id));

  if (loading || visibleBanners.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-6">
      {visibleBanners.map((banner) => {
        const Icon = bannerIcons[banner.type];
        
        return (
          <div
            key={banner.id}
            className={`relative rounded-lg border p-4 pr-12 ${bannerStyles[banner.type]}`}
          >
            <div className="flex items-start gap-3">
              {/* Banner Image or Icon */}
              {banner.image_url ? (
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Icon className="h-6 w-6 flex-shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-current">{banner.title}</h3>
                <p className="text-sm mt-1 break-words text-current opacity-90">{banner.message}</p>
              </div>
            </div>
            
            <button
              onClick={() => dismissBanner(banner.id)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}