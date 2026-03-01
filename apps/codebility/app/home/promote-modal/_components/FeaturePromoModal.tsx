"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const dismissed = sessionStorage.getItem("codebility_promo_modal_dismissed_v1");
  if (!dismissed) {
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }
}, []);

function handleOpenChange(value: boolean) {
  if (!value) sessionStorage.setItem("codebility_promo_modal_dismissed_v1", "true");
  setOpen(value);
}

  function handleCTA() {
    handleOpenChange(false);
    router.push(data.cta_href);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl overflow-hidden p-0">
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400" />

        <div className="px-6 pb-6 pt-5">
          <DialogHeader>
            {data.badge && (
              <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                ✨ {data.badge}
              </span>
            )}
            <DialogTitle className="text-2xl font-bold leading-tight">
              {data.headline}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {data.subheadline}
            </DialogDescription>
          </DialogHeader>

          {data.features?.length > 0 && (
            <ul className="mt-5 space-y-2.5">
              {data.features.map((f) => {
                const Icon = Icons[f.icon as keyof typeof Icons] as Icons.LucideIcon;
                return (
                  <li
                    key={f.title}
                    className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60"
                  >
                    {Icon && (
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
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
      </DialogContent>
    </Dialog>
  );
}