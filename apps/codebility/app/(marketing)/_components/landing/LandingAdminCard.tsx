"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Codev } from "@/types/home/codev";
import { motion } from "framer-motion";

const capitalizeWords = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getInitials = (firstName?: string, lastName?: string) => {
  const first = (firstName ?? "").trim().charAt(0);
  const last = (lastName ?? "").trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  return initials || "?";
};

const AdminCard = ({ admin }: { admin: Codev }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const src = admin.image_url;
  const showPhoto = Boolean(src) && !errored;
  const initials = getInitials(admin.first_name, admin.last_name);

  const markLoaded = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleImgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) {
        markLoaded();
      }
    },
    [markLoaded],
  );

  return (
    <motion.div
      className="h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/profiles/${admin.id}`}
        prefetch
        className="block h-full cursor-pointer"
      >
      <div className="flex h-full w-full flex-col gap-4 rounded-lg">
        <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gray-800">
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-bold text-white/50"
              style={{ fontSize: 64, lineHeight: 1 }}
              aria-hidden
            >
              {initials}
            </span>
          </div>
          {showPhoto ? (
            <Image
              alt={`${admin.first_name} Avatar`}
              src={src!}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`rounded-lg object-cover transition-opacity duration-200 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={markLoaded}
              onError={() => setErrored(true)}
              ref={handleImgRef}
            />
          ) : null}
        </div>

        <motion.div
          className="flex w-full flex-col gap-1"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="md:text-md text-sm font-medium text-white lg:text-lg">
            {capitalizeWords(admin.first_name)}{" "}
            {capitalizeWords(admin.last_name)}
          </p>
          <div className="min-h-[2.5rem]">
            {admin.display_position ? (
              <p className="text-sm text-gray-300 lg:text-base">
                {admin.display_position}
              </p>
            ) : (
              <div className="text-sm lg:text-base">&nbsp;</div>
            )}
          </div>
        </motion.div>
      </div>
      </Link>
    </motion.div>
  );
};

export default AdminCard;
