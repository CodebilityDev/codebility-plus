"use client";

import DefaultAvatar from "@/components/global/codev/DefaultAvatar";
import { DialogHeader, DialogTitle } from "@/components/global/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/global/ui/tooltip";
import { IconFigma } from "@/components/marketing/services/IconFigma";
import { IconGithub } from "@/components/marketing/services/IconGithub";
import { IconLink } from "@/components/marketing/services/IconLink";
import type { ServiceDetailBodyProps } from "@/types/marketing/services/services";
import { getImageUrl, formatDate } from "@/utils/marketing/services/services";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ServiceDetailBody({ service }: ServiceDetailBodyProps) {

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