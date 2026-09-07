"use client";

import { Suspense, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultAvatar } from "@/public/assets/images";
import type { ServicesProjectDetail } from "@/lib/server/services-projects-cached";
import { fetchApiJson } from "@/utils/api-fetch";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DefaultAvatar from "@/components/DefaultAvatar";
import { VisuallyHidden } from "@/components/ui/visuallyHidden";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const IconGithub = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const IconLink = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconFigma = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148z" />
  </svg>
);

const detailPromises = new Map<string, Promise<ServicesProjectDetail | null>>();

function loadDetail(projectId: string): Promise<ServicesProjectDetail | null> {
  const cached = detailPromises.get(projectId);
  if (cached) return cached;

  const promise = fetchApiJson<ServicesProjectDetail>(
    `/api/services-projects?id=${encodeURIComponent(projectId)}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching services project detail:", result.error);
      return null;
    }
    return result.data;
  });

  detailPromises.set(projectId, promise);
  return promise;
}

function formatDate(dateString?: string) {
  if (!dateString) return "Not specified";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function getImageUrl(mainImage?: string) {
  if (mainImage) {
    return mainImage.startsWith("public")
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${mainImage}`
      : mainImage;
  }
  return defaultAvatar;
}

function ServiceDetailSkeleton() {
  return (
    <>
      <DialogHeader
        id="service-detail-header"
        className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-2"
      >
        <DialogTitle>
          <VisuallyHidden>Loading project</VisuallyHidden>
        </DialogTitle>
        <div className="mx-auto h-7 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-8 sm:w-56" />
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        <div className="mb-6 h-[200px] w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-[300px]" />

        <div className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 sm:p-6">
            <div className="mb-4 h-6 w-44 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-7 sm:w-52" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-48" />
              <div className="h-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-48" />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 sm:p-6">
            <div className="mb-4 h-6 w-36 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-7 sm:w-40" />
            <div className="flex gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ServiceDetailBody({ projectId }: { projectId: string }) {
  const service = use(loadDetail(projectId));

  if (!service) {
    return (
      <div className="px-4 py-12 text-center text-sm text-gray-500 sm:px-6">
        Project details unavailable.
      </div>
    );
  }

  const teamLead =
    service.members.find((member) => member.role === "team_leader") ?? null;
  const members = service.members.filter(
    (member) => member.role !== "team_leader",
  );

  return (
    <>
      <DialogHeader
        id="service-detail-header"
        className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-2"
      >
        <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
          {service.name}
        </DialogTitle>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        <div className="relative mb-6 h-[200px] sm:h-[300px] w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={getImageUrl(service.main_image)}
            alt={service.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h1 className="mb-2 text-xl sm:text-3xl font-extrabold">
                {service.name}
              </h1>
              <p className="max-w-2xl text-sm sm:text-lg text-gray-200">
                {service.tagline || "Innovative solutions for modern challenges"}
              </p>
            </motion.div>
          </div>

          {service.categories.length > 0 && (
            <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
              {service.categories.map((category) => (
                <div
                  key={category.id}
                  className="inline-flex items-center rounded-full bg-blue-600/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <section id="service-detail-info" className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 sm:p-6">
            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold sm:text-xl">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400 sm:h-8 sm:w-8 sm:text-lg">
                2
              </span>
              Project Information
            </h2>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                    Description / Project Overview
                  </h3>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {service.description ||
                      "A comprehensive overview of the project's goals, scope, and implementation."}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                    Key Features
                  </h3>
                  <div className="space-y-2">
                    {service.key_features && service.key_features.length > 0 ? (
                      service.key_features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                          <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                            {feature}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        Key features not specified
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-base font-semibold text-gray-700 dark:text-gray-300">
                    External Links
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {service.github_link && (
                      <Link
                        href={service.github_link}
                        target="_blank"
                        className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
                      >
                        <IconGithub className="h-4 w-4" />
                        <span className="font-medium">Github</span>
                      </Link>
                    )}
                    {service.website_url &&
                      service.website_url !== "" &&
                      service.website_url.toLowerCase() !== "n/a" &&
                      service.website_url !== "." && (
                        <Link
                          href={service.website_url}
                          target="_blank"
                          className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
                        >
                          <IconLink className="h-4 w-4" />
                          <span className="font-medium">Website</span>
                        </Link>
                      )}
                    {service.figma_link && (
                      <Link
                        href={service.figma_link}
                        target="_blank"
                        className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
                      >
                        <IconFigma className="h-4 w-4" />
                        <span className="font-medium">Figma</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {service.tech_stack && service.tech_stack.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {service.tech_stack.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                      Start Date
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {formatDate(service.start_date)}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                      End Date
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {formatDate(service.end_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(teamLead || members.length > 0) && (
            <div
              id="service-detail-team"
              className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 sm:p-6"
            >
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold sm:text-xl">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400 sm:h-8 sm:w-8 sm:text-lg">
                  3
                </span>
                Team Members
              </h2>

              <div className="flex flex-wrap gap-3 sm:flex-nowrap sm:overflow-x-auto sm:pb-2">
                {teamLead && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative flex-shrink-0">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-yellow-400">
                          {teamLead.image_url &&
                          teamLead.image_url.trim() !== "" ? (
                            <Image
                              src={teamLead.image_url}
                              alt={`${teamLead.first_name} ${teamLead.last_name}`}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <DefaultAvatar
                              size={48}
                              className="h-full w-full"
                            />
                          )}
                        </div>
                        <Crown className="absolute -right-1 -top-1 h-4 w-4 rotate-45 text-yellow-400 drop-shadow-lg" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {teamLead.first_name} {teamLead.last_name} (Lead)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {members.map((member) => (
                  <Tooltip key={member.id}>
                    <TooltipTrigger>
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-300 dark:border-gray-600">
                        {member.image_url && member.image_url.trim() !== "" ? (
                          <Image
                            src={member.image_url}
                            alt={`${member.first_name} ${member.last_name}`}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <DefaultAvatar size={40} className="h-full w-full" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {member.first_name} {member.last_name}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

interface ServiceDetailModalProps {
  projectId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal = ({
  projectId,
  isOpen,
  onClose,
}: ServiceDetailModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="max-w-full w-[95vw] sm:w-[90vw] lg:w-[80vw] h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden"
      >
        {projectId ? (
          <Suspense fallback={<ServiceDetailSkeleton />}>
            <ServiceDetailBody projectId={projectId} />
          </Suspense>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
