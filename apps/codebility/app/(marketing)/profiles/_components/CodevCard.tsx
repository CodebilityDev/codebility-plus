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
    className:
      "bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300",
  },
  GRADUATED: {
    label: "Graduated",
    className:
      "bg-green-500/20 backdrop-blur-sm text-green-200 border border-green-500/30 dark:bg-green-500/10 dark:text-green-300",
  },
  INACTIVE: {
    label: "Inactive",
    className:
      "bg-gray-500/20 backdrop-blur-sm text-gray-200 border border-gray-500/30 dark:bg-gray-500/10 dark:text-gray-300",
  },
  MENTOR: {
    label: "Mentor",
    className:
      "bg-purple-500/20 backdrop-blur-sm text-purple-200 border border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300",
  },
  ADMIN: {
    label: "Admin",
    className:
      "bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
  },
  DEPLOYED: {
    label: "Deployed",
    className:
      "bg-indigo-500/20 backdrop-blur-sm text-indigo-200 border border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300",
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

  // Line 119: Enhanced card wrapper with click redirect
  return (
    <div
      className="h-64"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onClick={() =>
          (window.location.href = `https://www.codebility.tech/profiles/${codev.id}`)
        }
        className="group relative flex h-full w-full cursor-pointer flex-col items-center justify-between rounded-lg border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        {/* Background decoration */}
        <div className="from-customBlue-50/30 dark:from-customBlue-950/10 absolute inset-0 bg-gradient-to-br to-purple-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-purple-950/10" />
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
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
                    "absolute -top-8 right-1/2 z-50 flex -translate-x-1/2 transform flex-col items-center justify-center rounded-lg px-4 py-2 shadow-xl",
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
                    ? "border-green-600 bg-green-500"
                    : "border-red-600 bg-red-500",
                )}
              ></p>
            </div>
          </div>
          <div className="col-span-1 flex justify-end">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  {/* Line 217: Added stopPropagation to prevent card click when button is clicked */}
                  <Link
                    href={`/profiles/${codev.id}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-white/30 bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
                    >
                      <BookOpenIcon className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="border border-white/20 bg-white/10 px-2 py-1 text-xs text-white backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  Read Bio
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex flex-col gap-1 text-center">
            <p className="md:text-md relative z-10 text-sm capitalize text-white dark:text-white lg:text-base">
              {codev.first_name} {codev.last_name}
            </p>
            {codev.display_position ? (
              <p className="relative z-10 text-sm text-gray-200 dark:text-gray-300">
                {codev.display_position}
              </p>
            ) : (
              <div className="relative z-10 text-sm lg:text-base">&nbsp;</div>
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
        <div
          className="relative z-20"
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <CodevHireCodevButton codevId={codev.id} />
        </div>
      </div>
    </div>
  );
};

export default CodevCard;
