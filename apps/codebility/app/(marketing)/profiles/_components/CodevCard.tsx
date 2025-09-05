"use client";

import type { Codev, InternalStatus } from "@/types/home/codev";
import type React from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CodevBadge from "@/components/CodevBadge";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { BookOpenIcon } from "lucide-react";

import { cn } from "@codevs/ui";
import { Button } from "@codevs/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@codevs/ui/tooltip";

import { CodevHireCodevButton } from "./CodevHireCodevButton";

interface Props {
  codev: Codev;
  color: string;
}

const STATUS_CONFIG: Record<
  InternalStatus,
  { label: string; className: string }
> = {
  TRAINING: {
    label: "Training",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
  MENTOR: {
    label: "Mentor",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
  },
};

const CodevCard = ({ codev, color }: Props) => {
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

  const internalStatus = codev.internal_status || "MENTOR";
  const statusConfig =
    STATUS_CONFIG[internalStatus as InternalStatus] || STATUS_CONFIG.MENTOR;

  const filteredLevel = useMemo(() => {
    return codev.level &&
      codev.codev_points &&
      Array.isArray(codev.codev_points)
      ? Object.fromEntries(
          Object.entries(codev.level)
            .filter(([skillCategoryId, levelValue]) => {
              return (
                levelValue > 0 &&
                codev.codev_points!.some(
                  (point) => point?.skill_category_id === skillCategoryId,
                )
              );
            })
            .sort(([skillCategoryIdA], [skillCategoryIdB]) => {
              const pointsA =
                codev.codev_points!.find(
                  (point) => point?.skill_category_id === skillCategoryIdA,
                )?.points || 0;
              const pointsB =
                codev.codev_points!.find(
                  (point) => point?.skill_category_id === skillCategoryIdB,
                )?.points || 0;
              return pointsB - pointsA;
            }),
        )
      : {};
  }, [codev.level, codev.codev_points]);

  return (
    <div
      className="h-64"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-gray-900 dark:bg-black-500 hover:bg-gray-800 dark:hover:bg-black-800 flex h-full w-full flex-col items-center justify-between rounded-lg p-4 shadow-2xl transition-colors">
        <div className="grid w-full grid-cols-4 gap-2">
          <div className="col-span-1" />
          <div className="relative col-span-2 flex justify-center">
            <Image
              alt={`${codev.first_name} Avatar`}
              src={
                codev.image_url &&
                (codev.image_url.startsWith("http") ||
                  codev.image_url.startsWith("/"))
                  ? codev.image_url
                  : "/assets/svgs/icon-codebility-black.svg"
              }
              width={70}
              height={70}
              className={`${color} h-[70px] w-[70px] rounded-full bg-cover object-cover p-0.5`}
              onMouseMove={handleMouseMove}
              onError={(e) => {
                console.error(
                  `Failed to load image for ${codev.first_name}: ${codev.image_url}`,
                );
                e.currentTarget.src = "/assets/svgs/icon-codebility-black.svg";
              }}
            />
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
                    "absolute -top-8 right-1/2 z-50 flex -translate-x-1/2 transform flex-col items-center justify-center rounded-md px-4 py-2 shadow-xl",
                    statusConfig.className,
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
                  "rounded-full border-2 p-2 text-[9px]",
                  codev.availability_status 
                    ? "bg-green-500 border-green-600" 
                    : "bg-red-500 border-red-600",
                )}
              ></p>
            </div>
          </div>
          <div className="col-span-1 flex justify-end">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Link href={`/profiles/${codev.id}`} target="_blank">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-gray-800 dark:bg-black-500 hover:bg-gray-700 dark:hover:bg-black-600 h-8 w-8 rounded-full transition-colors"
                    >
                      <BookOpenIcon className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 dark:bg-slate-700 px-2 py-1 text-xs text-white">
                  Read Bio
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex flex-col gap-1 text-center">
            <p className="md:text-md text-sm capitalize text-gray-900 dark:text-white lg:text-base">
              {codev.first_name} {codev.last_name}
            </p>
            {codev.display_position ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">{codev.display_position}</p>
            ) : (
              <div className="text-sm lg:text-base">&nbsp;</div>
            )}
          </div>
        </div>
        <div className="flex min-h-[20px] items-center justify-center">
          {filteredLevel && Object.keys(filteredLevel).length > 0 ? (
            <CodevBadge
              level={filteredLevel}
              className="transition-transform group-hover:scale-100"
            />
          ) : null}
        </div>
        <CodevHireCodevButton codevId={codev.id} hovered={hovered} />
      </div>
    </div>
  );
};

export default CodevCard;
