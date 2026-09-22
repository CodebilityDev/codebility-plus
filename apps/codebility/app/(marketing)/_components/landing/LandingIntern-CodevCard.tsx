"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

import ProgressiveMotion from "./ProgressiveMotion";

type Person = {
  id: string;
  name: string;
  role: "Intern" | "Codev";
  image?: string;
  display_position?: string;
};

const ROLE_CONFIG = {
  INTERN: "Intern" as const,
  CODEV: "Codev" as const,
} as const;

const ROLE_STYLES = {
  [ROLE_CONFIG.INTERN]: {
    cardClass: "bg-black-800 border-neutral-700",
    badgeClass: "bg-green-600/30 text-green-300 border border-green-500/30",
    label: "Intern",
  },
  [ROLE_CONFIG.CODEV]: {
    cardClass:
      "bg-gradient-to-br from-blue-900/90 to-black-800 border-blue-700/50",
    badgeClass: "bg-blue-600/30 text-blue-300 border border-blue-500/30",
    label: "Codev",
  },
} as const;

function Avatar({
  person,
  size = 80,
  position = "center top",
}: {
  person: Person;
  size?: number;
  position?: string;
}) {
  const getInitials = () => {
    const fullName = (person.name ?? "").trim();

    if (!fullName) return "";

    const nameParts = fullName.split(/\s+/).filter((p) => p.length > 0);

    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      if (firstName && lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      }
    } else if (nameParts.length === 1) {
      const singleName = nameParts[0];
      if (singleName) {
        return singleName.substring(0, 2).toUpperCase();
      }
    }

    return "";
  };

  const initials = getInitials();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const hasImage = Boolean(person.image) && !imgError;

  if (hasImage) {
    return (
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-full border-2 border-neutral-700 bg-gray-800"
        style={{ height: size, width: size }}
      >
        <img
          src={person.image}
          alt={person.name}
          onError={() => setImgError(true)}
          onLoad={() => setImgLoaded(true)}
          ref={(node) => {
            if (node?.complete && node.naturalWidth > 0) {
              setImgLoaded(true);
            }
          }}
          className={`absolute left-1/2 top-1/2 object-cover transition-opacity duration-200 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            objectPosition: position,
            width: `${size * 1.2}px`,
            height: `${size * 1.2}px`,
            transform: "translate(-50%, -50%)",
            display: "block",
          }}
          loading="lazy"
          decoding="async"
        />
        {!imgLoaded ? (
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            aria-hidden
          >
            <span
              className="font-bold text-white opacity-50"
              style={{ fontSize: Math.max(12, size * 0.38), lineHeight: 1 }}
            >
              {initials || "?"}
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full border-2 border-neutral-700 bg-gray-800"
      style={{ height: size, width: size }}
      aria-hidden
    >
      <span
        className="font-bold text-white"
        style={{ fontSize: Math.max(12, size * 0.38), lineHeight: 1 }}
      >
        {initials || "?"}
      </span>
    </div>
  );
}

type RoleStyle = (typeof ROLE_STYLES)[keyof typeof ROLE_STYLES];

function InternCard({
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
              <Avatar person={intern} size={64} />
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

export default function InternCards({
  interns,
  playOnMount = false,
}: {
  interns: Person[];
  playOnMount?: boolean;
}) {
  const isCodev = (person: Person): boolean => person.role === ROLE_CONFIG.CODEV;

  return (
    <ProgressiveMotion
      className="mx-auto w-full max-w-6xl py-10"
      y={60}
      duration={0.8}
      staggerChildren={0.1}
      playOnMount={playOnMount}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {interns.map((intern, idx) => {
          const roleStyles =
            ROLE_STYLES[intern.role] || ROLE_STYLES[ROLE_CONFIG.INTERN];

          return (
            <InternCard
              key={`${intern.name}-${idx}`}
              intern={intern}
              roleStyles={roleStyles}
              isCodev={isCodev(intern)}
              index={idx}
              progressive
            />
          );
        })}
      </div>
    </ProgressiveMotion>
  );
}
