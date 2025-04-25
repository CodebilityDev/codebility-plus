"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CodevBadge from "@/Components/CodevBadge";
import { IconArrowRight } from "@/public/assets/svgs";
import { Codev, InternalStatus } from "@/types/home/codev";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@codevs/ui";

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
    className: "bg-status-training text-status-training-text",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-status-graduated text-status-graduated-text",
  },
  INACTIVE: {
    label: "Inactive",
    className: "bg-status-inactive text-status-inactive-text",
  },
  MENTOR: {
    label: "Mentor",
    className: "bg-status-mentor text-status-mentor-text",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-status-admin text-status-admin-text",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-status-deployed text-status-deployed-text",
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

  return (
    <Link
      href={`/profiles/${codev.id}`}
      target="_blank"
      className="h-64"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-black-500 flex h-full w-full flex-col items-center justify-between gap-4 rounded-lg p-4 shadow-2xl lg:py-6">
        <div className="relative">
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
            unoptimized={true}
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
                  "absolute -top-8 left-1/2 z-50 flex -translate-x-1/2 transform flex-col items-center justify-center rounded-md px-4 py-2 shadow-xl",
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
                "border-black-100 rounded-full border-2 p-2 text-[9px]",
                codev.availability_status ? "bg-green" : "bg-red-500",
              )}
            ></p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col gap-1 text-center">
            <p className="md:text-md text-sm capitalize text-white lg:text-base">
              {codev.first_name} {codev.last_name}
            </p>
            {codev.display_position ? (
              <p className="text-gray text-sm">{codev.display_position}</p>
            ) : (
              <div className="text-sm lg:text-base">&nbsp;</div>
            )}
          </div>
          {/* Add CodevBadge here */}
          {codev.level && Object.keys(codev.level).length > 0 && (
            <div className="flex ">
              <CodevBadge
                level={codev.level}
                className=" transition-transform group-hover:scale-100"
              />
            </div>
          )}
        </div>
        <div className=" flex items-center gap-2 text-blue-100 duration-300 hover:ml-4">
          Read Bio
          <IconArrowRight />
        </div>
      </div>
    </Link>
  );
};

export default CodevCard;
