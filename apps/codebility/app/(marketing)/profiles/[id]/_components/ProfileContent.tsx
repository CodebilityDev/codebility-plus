"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon } from "lucide-react";
import { cn } from "@codevs/ui";
import {
  IconAbout,
  IconGithub,
  IconLink,
  IconSkills,
  IconLinkedInWhiteSmall,
} from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import CodevBadge from "@/components/CodevBadge";

import MarketingProgressiveSection from "../../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../../_shared/ProgressiveMotion";
import ProfileProjectsSection from "./ProfileProjectsSection";
import ProfileRatingSection from "./ProfileRatingSection";

type LevelMap = Record<string, number>;

function getFilteredLevel(level?: LevelMap): LevelMap {
  if (!level) return {};

  return Object.fromEntries(
    Object.entries(level).filter(([_, value]) => value > 0),
  );
}

interface ProfileContentProps {
  codev: Codev;
  availableSchedule: NonNullable<Codev["work_schedules"]>[number] | null;
}

export default function ProfileContent({
  codev,
  availableSchedule,
}: ProfileContentProps) {
  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const getBgColor = (id: string) => {
    const colors = [
      "bg-bg-codeviolet",
      "bg-bg-codemean",
      "bg-bg-codegreen",
      "bg-bg-codepink",
    ];
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getStatusBadge = () =>
    codev.availability_status
      ? "Available"
      : codev.nda_status
        ? "Under NDA"
        : "Unavailable";

  const sanitizeUrl = (url: string | undefined): string => {
    if (!url) return "#";
    return url
      .replace(process.env.NEXT_PUBLIC_APP_BASE_URL || "", "")
      .replace(process.env.NEXT_PUBLIC_APP_BASE_URL || "", "");
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours!);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const {
    first_name,
    last_name,
    image_url,
    display_position,
    portfolio_website,
    about,
    github,
    linkedin,
    tech_stacks,
    education,
    work_experience,
    availability_status,
  } = codev;

  const filteredLevel = React.useMemo(
    () => getFilteredLevel(codev.level),
    [codev.level],
  );

  const sidebarSkeleton = (
    <div className="bg-black-500 flex h-auto w-full basis-[30%] flex-col items-center justify-start gap-4 rounded-lg p-6 text-white shadow-lg lg:p-8">
      <div className="relative">
        <Image
          alt={`${first_name} Avatar`}
          src={image_url || "/assets/svgs/icon-codebility-black.svg"}
          width={200}
          height={200}
          className={`${getBgColor(codev.id)} h-[150px] w-[150px] rounded-full object-cover`}
        />
        <div className="absolute bottom-[7px] right-[7px]">
          <p
            className={`border-black-100 rounded-full px-2 text-[9px] ${
              availability_status ? "bg-green-500" : "bg-gray"
            }`}
          >
            {getStatusBadge()}
          </p>
        </div>
      </div>
      <p className="text-md text-center capitalize lg:text-2xl">
        {first_name || "Unknown"} {last_name || "Unknown"}
      </p>
      {display_position && (
        <div className="bg-darkgray rounded-lg px-4 py-2">
          <p className="text-center text-sm capitalize lg:text-lg">
            {display_position}
          </p>
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <div className="bg-black-500 flex h-auto w-full basis-[30%] flex-col items-center justify-start gap-4 rounded-lg p-6 text-white shadow-lg lg:p-8">
      <div className="relative transition-transform hover:scale-105">
        <Image
          alt={`${first_name} Avatar`}
          src={image_url || "/assets/svgs/icon-codebility-black.svg"}
          width={200}
          height={200}
          className={`${getBgColor(codev.id)} h-[150px] w-[150px] rounded-full object-cover`}
        />
        <div className="absolute bottom-[7px] right-[7px]">
          <p
            className={`border-black-100 rounded-full px-2 text-[9px] ${
              availability_status ? "bg-green-500" : "bg-gray"
            }`}
          >
            {getStatusBadge()}
          </p>
        </div>
      </div>
      <p className="text-md text-center capitalize lg:text-2xl">
        {first_name || "Unknown"} {last_name || "Unknown"}
      </p>
      {display_position && (
        <div className="bg-darkgray rounded-lg px-4 py-2">
          <p className="text-center text-sm capitalize lg:text-lg">
            {display_position}
          </p>
        </div>
      )}
      {codev.headline && (
        <p className="text-center text-sm capitalize lg:text-lg">
          {codev.headline}
        </p>
      )}
      <div className="flex gap-4">
        {linkedin && (
          <Link
            href={sanitizeUrl(linkedin)}
            target="_blank"
            className="bg-darkgray hover:bg-black-100 block rounded-lg p-2 transition duration-300 hover:scale-110"
          >
            <IconLinkedInWhiteSmall className="text-2xl" />
          </Link>
        )}
        {github && (
          <Link
            href={sanitizeUrl(github)}
            target="_blank"
            className="bg-darkgray hover:bg-black-100 block rounded-lg p-2 transition duration-300 hover:scale-110"
          >
            <IconGithub className="text-2xl" />
          </Link>
        )}
        {portfolio_website && (
          <Link
            href={sanitizeUrl(portfolio_website)}
            target="_blank"
            className="bg-darkgray hover:bg-black-100 block rounded-lg p-2 transition duration-300 hover:scale-110"
          >
            <IconLink className="text-2xl" />
          </Link>
        )}
      </div>

      {codev.level && (
        <CodevBadge
          level={filteredLevel}
          className="transition-transform group-hover:scale-100"
        />
      )}

      <ProfileRatingSection codevId={codev.id} />

      {tech_stacks && tech_stacks.length > 0 && (
        <div className="mt-4 w-full">
          <div className="mb-4 flex items-center gap-2">
            <IconSkills className="text-2xl" />
            <h3 className="text-md font-semibold lg:text-2xl">Skills</h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-4">
            {tech_stacks.map((stack) => (
              <div
                key={stack}
                className="transition-transform duration-300 hover:scale-125"
              >
                <Image
                  src={`/assets/svgs/techstack/icon-${stack.toLowerCase()}.svg`}
                  alt={stack}
                  width={25}
                  height={25}
                  className="h-6 w-6"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <ProfileProjectsSection codevId={codev.id} />

      {availableSchedule && (
        <div className="mt-6 w-full">
          <h3 className="text-md mb-4 font-semibold lg:text-lg">
            Work Schedule
          </h3>

          <div className="bg-black-100 flex flex-col gap-4 rounded-lg p-4 transition-shadow hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            {availableSchedule.start_time && availableSchedule.end_time && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  <span className="font-mono text-base">
                    {formatTime(availableSchedule.start_time)} -{" "}
                    {formatTime(availableSchedule.end_time)}
                  </span>
                  <span className="text-sm">PST</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              {allDays.map((day) => {
                const isAvailable =
                  availableSchedule.days_of_week.includes(day);

                return (
                  <div
                    key={day}
                    className={cn(
                      "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-all hover:scale-110",
                      isAvailable
                        ? "bg-purple-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-400"
                        : "rounded-full border text-gray-400 hover:bg-gray-600",
                    )}
                    title={day}
                  >
                    {day.charAt(0)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const detailsSkeleton = (
    <div className="bg-black-500 flex basis-[70%] flex-col gap-6 rounded-lg p-6 text-white shadow-lg lg:gap-14 lg:p-8">
      {about && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <IconAbout className="text-2xl" />
            <h3 className="text-md font-semibold lg:text-2xl">About</h3>
          </div>
          <p className="text-md text-gray lg:text-lg">{about}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6 flex flex-col gap-6 md:gap-12 lg:mt-16 lg:flex-row">
      <MarketingProgressiveSection skeleton={sidebarSkeleton}>
        {sidebarContent}
      </MarketingProgressiveSection>

      <MarketingProgressiveSection skeleton={detailsSkeleton}>
        <ProgressiveMotion
          className="bg-black-500 flex basis-[70%] flex-col gap-6 rounded-lg p-6 text-white shadow-lg lg:gap-14 lg:p-8"
          y={24}
          duration={0.55}
          staggerChildren={0.08}
        >
          {about && (
            <div data-progressive-child>
              <div className="mb-4 flex items-center gap-2">
                <IconAbout className="text-2xl" />
                <h3 className="text-md font-semibold lg:text-2xl">About</h3>
              </div>
              <p className="text-md text-gray lg:text-lg">{about}</p>
            </div>
          )}

          {education && education.length > 0 && (
            <div data-progressive-child>
              <h3 className="text-md mb-4 font-semibold lg:text-2xl">
                Education
              </h3>
              <div>
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-black-100 mb-4 rounded-lg p-6 transition-all hover:translate-x-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                  >
                    <p className="text-lg text-white">{edu.institution}</p>
                    {edu.degree && (
                      <p className="text-gray">
                        {edu.degree} ({edu.start_date || "N/A"} -{" "}
                        {edu.end_date || "Present"})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {work_experience && work_experience.length > 0 && (
            <div data-progressive-child>
              <h3 className="text-md mb-4 font-semibold lg:text-2xl">
                Experience
              </h3>
              <div className="flex flex-col gap-2">
                {work_experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-black-100 rounded-lg p-6 transition-all hover:translate-x-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                  >
                    <p className="text-lg font-semibold text-white">
                      {exp.position}
                    </p>
                    <p className="text-md text-gray font-semibold">
                      <span className="text-customViolet-100 mr-2">
                        {exp.company_name.toUpperCase()}
                      </span>
                      ({exp.date_from} - {exp.date_to || "Present"})
                    </p>
                    <p className="text-md text-gray font-semibold">
                      @{exp.location}
                    </p>
                    <p className="text-gray">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ProgressiveMotion>
      </MarketingProgressiveSection>
    </div>
  );
}
