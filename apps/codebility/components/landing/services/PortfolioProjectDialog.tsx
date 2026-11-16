"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/global/ui/dialog";
import {
  normalizePortfolioCategory,
  portfolioHref,
} from "@/constants/landing/services/content";
import type { PortfolioProject } from "@/types/landing/services/portfolio";

export function PortfolioProjectDialog({
  project,
}: {
  project: PortfolioProject;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function close() {
    router.replace(
      portfolioHref({
        category: normalizePortfolioCategory(searchParams.get("category")),
        search: searchParams.get("search") ?? undefined,
      }),
      { scroll: false },
    );
  }

  return (
    <Dialog open modal onOpenChange={(open) => !open && close()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] w-[95vw] max-w-[980px] overflow-y-auto border-[color:var(--cb-border)] bg-[#0B0B0D] p-0 sm:rounded-[var(--cb-radius-24)] md:p-0 lg:w-[80vw]"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#151515]">
          {project.imageSrc ? (
            <Image
              src={project.imageSrc}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 80vw, 95vw"
              className="object-cover object-top"
            />
          ) : null}
          <span className="absolute left-[var(--cb-space-20)] top-[var(--cb-space-20)] rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-white)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-bg)_80%,transparent)] px-[var(--cb-space-12)] py-[var(--cb-space-6)] text-xs text-[color:var(--cb-text-secondary)] backdrop-blur">
            {project.badge}
          </span>
        </div>

        <div className="flex flex-col gap-[var(--cb-space-20)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[color:var(--cb-text)] sm:text-3xl">
              {project.name}
            </DialogTitle>
          </DialogHeader>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--cb-text-secondary)]">
            {project.fullDescription}
          </p>
          {project.websiteUrl ? (
            <div>
              <a
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[var(--cb-size-44)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] bg-[color:var(--cb-primary)] px-[var(--cb-space-20)] text-sm font-medium text-[color:var(--cb-text)] transition-colors hover:bg-[color:var(--cb-primary-hover)]"
              >
                Visit live site
                <ArrowUpRight
                  aria-hidden
                  className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                />
              </a>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
