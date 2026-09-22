"use client";

import { useState } from "react";
import type { NewsBannerRow } from "@/lib/server/dashboard-reference-cached";
import { DISMISSED_BANNERS_COOKIE } from "./news-banner-cookie";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Megaphone,
  X,
  XCircle,
} from "lucide-react";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const bannerIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  announcement: Megaphone,
};

const bannerStyles = {
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
  warning:
    "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
  success:
    "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
  error:
    "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  announcement:
    "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200",
};

function readDismissed() {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${DISMISSED_BANNERS_COOKIE}=`));

  if (!match) return [];

  return decodeURIComponent(match.slice(match.indexOf("=") + 1))
    .split(",")
    .filter(Boolean);
}

export default function NewsBannerList({
  banners,
}: {
  banners: NewsBannerRow[];
}) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const dismissBanner = (bannerId: string) => {
    const next = Array.from(new Set([...readDismissed(), bannerId]));
    document.cookie = `${DISMISSED_BANNERS_COOKIE}=${encodeURIComponent(
      next.join(","),
    )}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    setDismissed((prev) => [...prev, bannerId]);
  };

  const visibleBanners = banners.filter(
    (banner) => !dismissed.includes(banner.id),
  );

  if (visibleBanners.length === 0) return null;

  return (
    <div className="mb-3 space-y-2">
      {visibleBanners.map((banner) => {
        const Icon = bannerIcons[banner.type];

        return (
          <div
            key={banner.id}
            className={`relative mt-3 rounded-lg border p-4 pr-12 ${bannerStyles[banner.type]}`}
          >
            <div className="flex items-start gap-3">
              {banner.image_url ? (
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <Icon className="mt-0.5 h-6 w-6 flex-shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-current">
                  {banner.title}
                </h3>
                <p className="mt-1 break-words text-sm text-current opacity-90">
                  {banner.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => dismissBanner(banner.id)}
              className="absolute right-3 top-3 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
