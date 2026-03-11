"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FeatureModal } from "../type";
import * as Icons from "lucide-react";

export default function FeaturePromoModal({ data }: { data: FeatureModal }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const dismissed = sessionStorage.getItem(
      "codebility_promo_modal_dismissed_v1"
    );
    if (!dismissed) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  function handleOpenChange(value: boolean) {
    if (!value)
      sessionStorage.setItem("codebility_promo_modal_dismissed_v1", "true");
    setOpen(value);
  }

  function handleCTA() {
    handleOpenChange(false);
    router.push(data.cta_href);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/*
        Mobile:  single column — image on top, content below
        md+:     two columns — image left (45%), content right (55%)
      */}
      <DialogContent className="gap-0 overflow-hidden p-0 w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl">
        <div className="flex flex-col md:flex-row md:min-h-[480px]">

          {/* ── LEFT: Image panel ── */}
          <div className="relative h-48 w-full shrink-0 md:h-auto md:w-[45%]">
            {/* Gradient strip — top on mobile */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 z-10 md:hidden" />

            <Image
              src={data.image_url}
              alt="Feature preview"
              fill
              className="object-cover"
              priority
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />

            {/* Badge on image — mobile only */}
            {data.badge && (
              <div className="absolute bottom-4 left-4 md:hidden">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-xs font-semibold text-white">
                  ✨ {data.badge}
                </span>
              </div>
            )}

            {/* Vertical gradient strip on right edge — desktop only */}
            <div className="hidden md:block absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 via-blue-500 to-cyan-400" />
          </div>

          {/* ── RIGHT: Content panel ── */}
          <div className="flex flex-col flex-1 px-6 py-6 md:px-7 md:py-7 overflow-y-auto">
            <DialogHeader>
              {/* Badge — desktop only */}
              {data.badge && (
                <span className="hidden md:inline-flex mb-3 w-fit items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  ✨ {data.badge}
                </span>
              )}

              <DialogTitle className="text-xl font-bold leading-tight sm:text-2xl text-gray-900 dark:text-white">
                {data.headline}
              </DialogTitle>

              <DialogDescription className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {data.subheadline}
              </DialogDescription>
            </DialogHeader>

            {/* Features */}
            {data.features?.length > 0 && (
              <ul className="mt-5 space-y-2.5 flex-1">
                {data.features.map((f) => {
                  const Icon = Icons[
                    f.icon as keyof typeof Icons
                  ] as Icons.LucideIcon;
                  return (
                    <li
                      key={f.title}
                      className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60"
                    >
                      {Icon && (
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {f.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {f.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={handleCTA}
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {data.cta_label} →
              </button>
              <button
                onClick={() => handleOpenChange(false)}
                className="flex-1 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                {data.dismiss_label}
              </button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}