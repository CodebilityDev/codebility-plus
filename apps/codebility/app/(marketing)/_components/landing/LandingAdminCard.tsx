"use client";

import { Codev } from "@/types/home/codev";
import { motion } from "framer-motion";

import LandingImage from "./LandingImage";

const capitalizeWords = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AdminCard = ({ admin }: { admin: Codev }) => {
  const defaultImage = "/assets/svgs/icon-codebility-black.svg";

  return (
    <motion.div
      className="h-full cursor-pointer"
      onClick={() =>
        (window.location.href = `https://www.codebility.tech/profiles/${admin.id}`)
      }
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex h-full w-full flex-col gap-4 rounded-lg">
        <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="relative h-full w-full">
            <LandingImage
              alt={`${admin.first_name} Avatar`}
              src={admin.image_url || defaultImage}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-lg object-cover"
            />
          </div>
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
    </motion.div>
  );
};

export default AdminCard;
