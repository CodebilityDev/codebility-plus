"use client";

import { useState } from "react";
import CodevBadge from "@/components/CodevBadge";
import DefaultAvatar from "@/components/DefaultAvatar";
import Box from "@/components/shared/dashboard/Box";
import { useModal } from "@/hooks/use-modal-users";
import { Codev, CodevPoints, ApplicantStatus } from "@/types/home/codev";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

import TechStacks from "./TechStacks";

interface CodevCardProps {
  codev: Codev;
}

const STATUS_CONFIG: Record<
  ApplicantStatus,
  { label: string; className: string }
> = {
  applying: {
    label: "Applying",
    className: "bg-customBlue-500/20 backdrop-blur-sm text-customBlue-200 border border-customBlue-500/30 dark:bg-customBlue-500/10 dark:text-customBlue-300",
  },
  testing: {
    label: "Testing",
    className: "bg-orange-500/20 backdrop-blur-sm text-orange-200 border border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300",
  },
  onboarding: {
    label: "Onboarding",
    className: "bg-purple-500/20 backdrop-blur-sm text-purple-200 border border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300",
  },
  denied: {
    label: "Denied",
    className: "bg-red-500/20 backdrop-blur-sm text-red-200 border border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
  },
  passed: {
    label: "Passed",
    className: "bg-green-500/20 backdrop-blur-sm text-green-200 border border-green-500/30 dark:bg-green-500/10 dark:text-green-300",
  },
};

export default function CodevCard({ codev }: CodevCardProps) {
  const { onOpen } = useModal();

  // Helper function to safely check array length
  const hasItems = (arr: any[] | undefined): arr is any[] => {
    return Array.isArray(arr) && arr.length > 0;
  };

  const [hovered, setHovered] = useState(false);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: React.MouseEvent) => {
    const halfWidth = (event.target as HTMLElement).offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const applicationStatus = codev.application_status || "applying";
  const statusConfig = STATUS_CONFIG[applicationStatus as ApplicantStatus] || STATUS_CONFIG.applying;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div
        className="group relative h-full rounded-2xl bg-white/10 backdrop-blur-md p-4 shadow-lg transition-all duration-300 hover:bg-white/20 hover:shadow-xl dark:bg-white/5 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-customBlue-50/20 to-purple-50/20 dark:from-customBlue-950/10 dark:to-purple-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div
          className="flex h-full cursor-pointer flex-col justify-start gap-4"
          onClick={() => onOpen("profileModal", codev)}
        >
          {/* Header Section */}
          <div className="relative flex items-start justify-start gap-4">
            <div className="relative">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-customBlue-100 to-purple-100 p-0.5 dark:from-customBlue-900 dark:to-purple-900">
                <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-gray-800">
                  {codev.image_url ? (
                    <img
                      src={codev.image_url}
                      alt={`${codev.first_name}'s avatar`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <DefaultAvatar size={64} className="mx-auto" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {hovered && applicationStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 10,
                      },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.6 }}
                    style={{
                      translateX: translateX,
                      rotate: rotate,
                      whiteSpace: "nowrap",
                    }}
                    className={cn(
                      `absolute -top-16 left-1/2 z-[100] flex -translate-x-1/2
                       transform flex-col items-center justify-center rounded-xl px-3 py-2 shadow-xl 
                        ${statusConfig?.className || ''}
                       `,
                    )}
                  >
                    <div className="relative z-30 text-sm font-medium">
                      {statusConfig?.label || 'Applying'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute -bottom-1 -right-1">
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 border-white dark:border-gray-800",
                    codev.availability_status === true ? "bg-green-500" : "bg-red-500",
                  )}
                ></div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-start justify-start gap-2">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {codev.first_name} {codev.last_name}
              </h3>
              <p className="text-sm font-medium text-customBlue-300 dark:text-customBlue-100">
                {codev.display_position || "No Position"}
              </p>
              {/* Years of Experience */}
              {codev.years_of_experience !== undefined && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {codev.years_of_experience}{" "}
                  {codev.years_of_experience === 1 ? "year" : "years"} experience
                </div>
              )}
              {/* Add CodevBadge here */}
              {codev.level && Object.keys(codev.level).length > 0 && (
                <div className="mt-1">
                  <CodevBadge level={codev.level} size={20} />
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-4">
            {/* points */}
            <div className="flex flex-col gap-3">
              <SkillPoints points={codev.codev_points ?? []} />
            </div>

            {/* Tech Stacks */}
            {hasItems(codev.tech_stacks) && (
              <div>
                <TechStacks techStacks={codev.tech_stacks} />
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="mt-auto flex flex-wrap justify-end gap-2">
            {hasItems(codev.projects) ? (
              codev.projects.map((project) => (
                <Badge
                  variant="info"
                  key={project.id}
                  className="rounded-full bg-gradient-to-r from-customBlue-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white transition-all duration-300
                    hover:from-customBlue-700 hover:to-indigo-700 dark:from-customBlue-500 dark:to-indigo-500 dark:hover:from-customBlue-600 dark:hover:to-indigo-600
                  "
                >
                  {project.name}
                </Badge>
              ))
            ) : (
              <Badge
                variant="info"
                className="rounded-full bg-gradient-to-r from-gray-500 to-gray-600 px-3 py-1 text-xs font-medium text-white dark:from-gray-600 dark:to-gray-700"
              >
                Available for Projects
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillPoints({ points }: { points: CodevPoints[] }) {
  const matcher: { [key: string]: string } = {
    "059261f5-be65-4872-beaf-0c09524c98eb": "UI/UX",
    "0dde069d-71fd-4240-b38e-d7c197b4bf1b": "Backend",
    "13bf852a-9bca-411f-8643-fbac8b8dd533": "Mobile",
    "27dbaa4f-d5f1-41c0-898a-ba19cfe06367": "QA",
    "96da3c02-a270-4fe7-b079-72642ff9e93e": "Frontend",
  };

  return (
    <div className="flex flex-wrap gap-1">
      {Object.keys(matcher).map((categoryId) => {
        const point = points.find((p) => p.skill_category_id === categoryId);
        return (
          <div
            key={categoryId}
            className="flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-lg bg-white/50 p-1 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:bg-gray-700/50 dark:hover:bg-gray-700/80"
          >
            {/* skill points */}
            <p className="text-center text-xs font-bold text-gray-800 dark:text-gray-200">
              {point ? point.points : 0}
            </p>

            {/* skill category */}
            <p className="text-center text-[8px] font-medium text-gray-600 dark:text-gray-400">
              {matcher[categoryId] ?? "Unknown"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
