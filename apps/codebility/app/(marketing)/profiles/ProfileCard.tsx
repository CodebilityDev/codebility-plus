"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { profiles_ProfieCardT } from "@/types/home"
import { IconArrowRight } from "@/public/assets/svgs"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"

const ProfileCard = ({ user, color }: profiles_ProfieCardT) => {
  const [hovered, setHovered] = useState(false)
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0) // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig)
  // translate the tooltip
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig)
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth) // set the x value, which is then used in transform and rotate
  }
  return (
    <Link
      href={`/profiles/${user.id}`}
      target="_blank"
      className="h-64"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`flex h-full w-full flex-col items-center justify-between gap-4 rounded-lg bg-black-500 p-4 shadow-2xl lg:py-6`}
      >
        <div className="relative">
          <Image
            alt={`${user.first_name} Avatar`}
            src={user.image_url || "/assets/svgs/icon-codebility-black.svg"}
            width={60}
            height={60}
            className={`${color} h-[70px] w-[70px] rounded-full bg-cover object-cover p-0.5`}
            onMouseMove={handleMouseMove}
          />
          <AnimatePresence>
            {hovered && (
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
                className={`${
                  user.jobStatusType === "AVAILABLE" ? "bg-green" : "bg-orange-400"
                } -top-25 absolute left-1/2 z-50 flex -translate-x-1/2 transform flex-col items-center justify-center rounded-md  px-4 py-2 shadow-xl`}
              >
                <div className="relative z-30 text-base  text-white">
                  {user.jobStatusType === "AVAILABLE" ? "Available" : "Deployed"}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute bottom-[1px] right-[1px]">
            <p
              className={`rounded-full border-2 border-black-100 p-2 text-[9px] ${
                user.jobStatusType === "AVAILABLE"
                  ? "bg-green"
                  : user.jobStatusType === "DEPLOYED"
                  ? "bg-orange-400"
                  : "bg-gray"
              }`}
            ></p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="md:text-md text-sm capitalize text-white lg:text-base">
            {user.first_name} {user.last_name}
          </p>
          {user.main_position ? (
            <p className="text-sm text-gray">{user.main_position}</p>
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
  )
}

export default ProfileCard