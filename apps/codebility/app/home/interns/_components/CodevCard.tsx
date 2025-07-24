"use client";

import { useState } from "react";
import CodevBadge from "../components/CodevBadge";
import DefaultAvatar from "../components/DefaultAvatar";
import Box from "../components/shared/dashboard/Box";
import { useModal } from "@/hooks/use-modal-users";
import { Codev, CodevPoints, InternalStatus } from "@/types/home/codev";
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
  InternalStatus,
  { label: string; className: string }
> = {
  TRAINING: {
    label: "Training",
    className: "bg-status-training text-status-training-text",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-status-graduated text-status-graduated-text",
  },
  INACTIVE: {
    label: "Busy",
    className: "bg-status-busy text-status-busy-text",
  },
  MENTOR: {
    label: "Available",
    className: "bg-status-available text-status-available-text",
  },
  ADMIN: {
    label: "Deployed",
    className: "bg-status-deployed text-status-deployed-text",
  },
  DEPLOYED: {
    label: "Client Ready",
    className: "bg-status-clientready text-status-clientready-text",
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

  const internalStatus = codev.internal_status || "AVAILABLE";
  const statusConfig = STATUS_CONFIG[internalStatus as InternalStatus];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box
        className={`
      h-full w-full rounded-lg border-none px-0 
      py-2 transition-all hover:shadow-lg
      dark:shadow-slate-700
      `}
      >
        <div
          className="flex h-full cursor-pointer flex-col justify-start gap-4 px-4 py-2"
          onClick={() => onOpen("profileModal", codev)}
        >
          {/* Header Section */}
          <div className="relative flex items-start justify-start gap-4 text-center ">
            <div className=" relative rounded-full border-2">
              {codev.image_url ? (
                <div className="relative h-24 w-24">
                  <img
                    src={codev.image_url}
                    alt={`${codev.first_name}'s avatar`}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <DefaultAvatar size={96} className="mx-auto" />
              )}

              <AnimatePresence>
                {hovered && internalStatus && (
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
                      `absolute -top-8 left-1/2 z-50 flex -translate-x-1/2
                       transform flex-col items-center justify-center rounded-md p-2 shadow-xl 
                        ${statusConfig.className}
                       `,
                    )}
                  >
                    <div className="relative z-30 text-base">
                      {statusConfig.label}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-[1px] right-[1px]">
                <p
                  className={cn(
                    "rounded-full p-[0.7rem] text-[9px]",
                    codev.availability_status ? "bg-green" : "bg-red-500",
                  )}
                ></p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-1">
              <h3 className="text-start text-lg font-semibold text-gray-900 dark:text-gray-100">
                {codev.first_name} {codev.last_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {codev.display_position || "No Position"}
              </p>
              {/* Years of Experience */}
              {codev.years_of_experience !== undefined && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {codev.years_of_experience}{" "}
                  {codev.years_of_experience === 1 ? "year" : "years"} of
                  experience
                </div>
              )}
              {/* Add CodevBadge here */}
              {codev.level && Object.keys(codev.level).length > 0 && (
                <div className="mt-1">
                  <CodevBadge level={codev.level} size={24} />
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800">
            {/* points */}
            <div className="flex flex-col gap-2">
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
          <div className="mt-auto flex flex-wrap justify-end gap-1">
            {hasItems(codev.projects) ? (
              codev.projects.map((project) => (
                <Badge
                  variant="info"
                  key={project.id}
                  className="bg-blue-50 text-xs text-blue-800 transition duration-300
                    hover:bg-blue-300 hover:text-white dark:bg-blue-500 dark:text-white
                  "
                >
                  {project.name}
                </Badge>
              ))
            ) : (
              <Badge
                variant="info"
                className={`
                  bg-gray-50 text-gray-800 dark:bg-slate-700 dark:text-slate-200
                `}
              >
                Available for Projects
              </Badge>
            )}
          </div>
        </div>
      </Box>
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
    <div className="flex flex-wrap gap-2">
      {Object.keys(matcher).map((categoryId) => {
        const point = points.find((p) => p.skill_category_id === categoryId);
        return (
          <div
            key={categoryId}
            className={`dark:bg-black-200 flex h-14 w-14 flex-col items-center
          justify-center gap-1 rounded-md
          bg-slate-100 p-1
          `}
          >
            {/* skill points */}
            <p
              className={`text-center text-xs font-semibold text-gray-700 dark:text-gray-300
          `}
            >
              {point ? point.points : 0}
            </p>

            {/* skill category */}
            <p className="text-center text-xs text-gray-600 dark:text-gray-400">
              {matcher[categoryId] ?? "Unknown"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
