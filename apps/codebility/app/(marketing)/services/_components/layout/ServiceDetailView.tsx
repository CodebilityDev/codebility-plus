"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getMembers,
  getTeamLead,
  SimpleMemberData,
} from "@/app/home/projects/actions";
import { defaultAvatar } from "@/public/assets/images";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Button } from "@codevs/ui";

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

export const ServiceDetailView = ({ service, onBack }) => {
  const formatDate = (dateString) => {
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
  };

  // Fetch team lead data
  const { data: teamLead } = useQuery({
    queryKey: ["teamLead", service?.id],
    queryFn: async () => {
      if (!service?.id) return null;
      const result = await getTeamLead(service.id);
      return result.data;
    },
    enabled: !!service?.id,
  });

  // Fetch members data
  const { data: members = [] } = useQuery({
    queryKey: ["members", service?.id],
    queryFn: async () => {
      if (!service?.id) return [];
      const result = await getMembers(service.id);
      return result.data || [];
    },
    enabled: !!service?.id,
  });

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 pb-24 sm:px-6 md:pb-8">
      {/* Back Button */}
      <div className="mb-6 mt-24">
        <Button
          onClick={onBack}
          className="from-customTeal to-customViolet-100 via-customBlue-100 h-12 rounded-full bg-gradient-to-r p-0.5 hover:bg-gradient-to-br md:w-40"
        >
          <span className="bg-black-500 flex h-full w-full items-center justify-center rounded-full text-sm text-white lg:text-lg">
            ← Back to Services
          </span>
        </Button>
      </div>

      {/* 1. Project Image with Name and Tagline */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <Image
          src={service.main_image || defaultAvatar}
          alt={service.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h1 className="mb-3 text-4xl font-extrabold md:text-6xl">
              {service.name}
            </h1>
            <p className="max-w-2xl text-lg text-gray-200 md:text-xl">
              {service.tagline || "Innovative solutions for modern challenges"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. Project Information */}
      <section className="mt-12">
        <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              2
            </span>
            Project Information
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Description / Project Overview
                </h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {service.description ||
                    "A comprehensive overview of the project's goals, scope, and implementation."}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Key Features
                </h3>
                <div className="space-y-2">
                  {service.key_features ? (
                    Array.isArray(service.key_features) ? (
                      service.key_features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
                          <span className="text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">
                        {service.key_features}
                      </p>
                    )
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      Key features not specified
                    </p>
                  )}
                </div>
              </div>

              {/* External Links */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  External Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {service.github_link && (
                    <Link
                      href={service.github_link}
                      target="_blank"
                      className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <IconGithub className="h-4 w-4" />
                      <span className="text-sm font-medium">Github</span>
                    </Link>
                  )}
                  {service.website_url && (
                    <Link
                      href={service.website_url}
                      target="_blank"
                      className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <IconLink className="h-4 w-4" />
                      <span className="text-sm font-medium">Website</span>
                    </Link>
                  )}
                  {service.figma_link && (
                    <Link
                      href={service.figma_link}
                      target="_blank"
                      className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <IconFigma className="h-4 w-4" />
                      <span className="text-sm font-medium">Figma</span>
                    </Link>
                  )}
                  {!service.github_link &&
                    !service.website_url &&
                    !service.figma_link && (
                      <p className="text-gray-500 dark:text-gray-400">
                        No external links available
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Current Status */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Current Status
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    service.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : service.status === "inprogress"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {service.status === "inprogress"
                    ? "In Progress"
                    : service.status
                      ? service.status.charAt(0).toUpperCase() +
                        service.status.slice(1)
                      : "Completed"}
                </span>
              </div>

              {/* Project Categories */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Project Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.categories && service.categories.length > 0 ? (
                    service.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {category.name || category}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Web Applications
                    </span>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Duration
                </h3>
                <div className="text-gray-600 dark:text-gray-300">
                  <p>
                    Start:{" "}
                    {service.start_date
                      ? formatDate(service.start_date).split(",")[0]
                      : "31/12/2025"}
                  </p>
                  <p>
                    End:{" "}
                    {service.end_date
                      ? formatDate(service.end_date).split(",")[0]
                      : "Ongoing"}
                  </p>
                </div>
              </div>

              {/* Created */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Created
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.created_at
                    ? formatDate(service.created_at)
                    : "31/12/2025 03:58:22 PM"}
                </p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          {service.tech_stack && service.tech_stack.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Team Information */}
      <section className="mt-12">
        <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              3
            </span>
            Team Information
          </h2>

          <div className="space-y-8">
            {/* Team Leader */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Team Leader
              </h3>
              {teamLead ? (
                <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 dark:border-gray-600">
                  <div className="relative h-12 w-12">
                    <Image
                      src={teamLead.image_url || defaultAvatar}
                      alt={`${teamLead.first_name} ${teamLead.last_name}`}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {teamLead.first_name} {teamLead.last_name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {teamLead.display_position || "Team Lead"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Team leader not assigned
                </p>
              )}
            </div>

            {/* Team Members */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Team Members
              </h3>
              {members && members.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {members.map((member, index) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 dark:border-gray-600"
                    >
                      <div className="relative h-12 w-12">
                        <Image
                          src={member.image_url || defaultAvatar}
                          alt={`${member.first_name} ${member.last_name}`}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.display_position || "Team Member"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No team members assigned
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Project Gallery */}
      <section className="mt-12">
        <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              4
            </span>
            Project Gallery
          </h2>

          {service.gallery && service.gallery.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {service.gallery.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative h-48 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600"
                >
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative h-48 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                <Image
                  src={service.main_image || defaultAvatar}
                  alt="Project showcase"
                  fill
                  className="object-cover"
                />
              </div>
              {service.secondary_image && (
                <div className="relative h-48 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                  <Image
                    src={service.secondary_image}
                    alt="Project showcase 2"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
