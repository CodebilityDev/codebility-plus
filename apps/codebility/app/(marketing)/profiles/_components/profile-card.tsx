"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowRight } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface Props {
  codev: Codev;
  color: string;
}

const ProfileCard = ({ codev, color }: Props) => {
  const [hovered, setHovered] = useState(false);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // Used to track mouse position
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

  const statusStyles = {
    AVAILABLE: "bg-green",
    DEPLOYED: "bg-orange-400",
    TRAINING: "bg-blue-400",
    BUSY: "bg-gray",
  };

  const internalStatus = codev.internal_status || "UNKNOWN"; // Fallback for undefined or null

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
              codev.image_url && codev.image_url.startsWith("http")
                ? codev.image_url
                : "/assets/svgs/icon-codebility-black.svg"
            }
            width={70}
            height={70}
            className={`${color} h-[70px] w-[70px] rounded-full bg-cover object-cover p-0.5`}
            onMouseMove={handleMouseMove}
          />
          <AnimatePresence>
            {hovered && internalStatus !== "UNKNOWN" && (
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
                className={`absolute -top-8 left-1/2 z-50 flex -translate-x-1/2 transform flex-col items-center justify-center rounded-md px-4 py-2 shadow-xl ${
                  statusStyles[internalStatus as keyof typeof statusStyles] ||
                  "bg-gray"
                }`}
              >
                <div className="relative z-30 text-base text-white">
                  {internalStatus.charAt(0) +
                    internalStatus.slice(1).toLowerCase()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute bottom-[1px] right-[1px]">
            <p
              className={`border-black-100 rounded-full border-2 p-2 text-[9px] ${
                statusStyles[internalStatus as keyof typeof statusStyles] ||
                "bg-gray"
              }`}
            ></p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="md:text-md text-sm capitalize  text-white lg:text-base">
            {codev.first_name} {codev.last_name}
          </p>
          {codev.display_position ? (
            <p className="text-gray text-sm">{codev.display_position}</p>
          ) : (
            <div className="text-sm lg:text-base">&nbsp;</div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-blue-100 duration-300 hover:ml-4">
          Read Bio
          <IconArrowRight />
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
