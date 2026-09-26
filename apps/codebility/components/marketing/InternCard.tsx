"use client";

import { Card, CardContent } from "@/components/marketing/card";
import { InternCardsAvatar } from "@/components/marketing/InternCardsAvatar";
import type { Person, RoleStyle } from "@/types/marketing/marketing";
import { motion } from "framer-motion";
import Link from "next/link";

export function InternCard({
  intern,
  roleStyles,
  isCodev,
  index,
  progressive,
}: {
  intern: Person;
  roleStyles: RoleStyle;
  isCodev: boolean;
  index: number;
  progressive?: boolean;
}) {
  return (
    <motion.div
      data-progressive-child={progressive ? true : undefined}
      whileHover={{
        scale: 1.05,
        y: -10,
        rotateY: 5,
        transition: {
          duration: 0.3,
          type: "spring",
          bounce: 0.4,
        },
      }}
      whileTap={{ scale: 0.95 }}
      style={{ perspective: "1000px" }}
      className="cursor-pointer"
    >
      <Link href={`/profiles/${intern.id}`} prefetch className="block h-full">
      <motion.div
        className="relative h-full"
        whileHover={{
          boxShadow: isCodev
            ? "0 20px 40px -12px rgba(59, 130, 246, 0.3)"
            : "0 20px 40px -12px rgba(34, 197, 94, 0.3)",
        }}
        transition={{ duration: 0.3 }}
      >
        <Card
          className={`flex h-full w-full min-w-0 flex-col items-center overflow-hidden rounded-sm border text-white shadow-2xl relative ${roleStyles.cardClass}`}
          style={{
            height: "270px",
            minHeight: "270px",
            maxHeight: "270px",
          }}
        >
          <motion.div
            className={`absolute inset-0 rounded-sm opacity-0 ${
              isCodev
                ? "bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20"
                : "bg-gradient-to-br from-green-500/20 via-transparent to-emerald-500/20"
            }`}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className={`absolute right-2 top-2 h-3 w-3 rounded-full ${
              isCodev ? "bg-blue-400" : "bg-green-400"
            }`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
          />

          <CardContent className="relative z-10 flex h-full w-full flex-col items-center p-3 sm:p-4">
            <motion.div
              className="flex items-center justify-center pb-0 pt-6"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <InternCardsAvatar person={intern} size={64} />
            </motion.div>

            <div className="flex w-full flex-grow flex-col items-center justify-center space-y-2 sm:space-y-3">
              <div className="flex items-center justify-center">
                <motion.h3
                  className="line-clamp-2 break-words px-1 text-center text-xs font-medium leading-tight sm:px-2 sm:text-sm"
                  whileHover={{
                    color: isCodev ? "#60a5fa" : "#4ade80",
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {intern.name}
                </motion.h3>
              </div>

              <div className="flex items-center justify-center">
                <motion.div
                  className={`rounded-full px-2 py-1 text-xs font-medium sm:px-3 ${roleStyles.badgeClass}`}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: isCodev
                      ? "0 4px 15px rgba(59, 130, 246, 0.3)"
                      : "0 4px 15px rgba(34, 197, 94, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {roleStyles.label}
                </motion.div>
              </div>

              <div className="flex items-center justify-center">
                <p className="line-clamp-2 px-1 text-center text-xs leading-tight opacity-70 sm:px-2 sm:text-sm">
                  {intern.display_position || roleStyles.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </Link>
    </motion.div>
  );
}
