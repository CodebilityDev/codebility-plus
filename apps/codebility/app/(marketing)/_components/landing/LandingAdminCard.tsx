"use client";

import { Codev } from "@/types/home/codev";
import { cn } from "@codevs/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

// Utility function to capitalize the first letter of each word
const capitalizeWords = (text: string) => {
    return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const AdminCard = ({ admin }: { admin: Codev }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const defaultImage = "/assets/svgs/icon-codebility-black.svg";

    // Line 18: Enhanced with onClick redirect and hover effects
    return (
        <motion.div
            className="h-full cursor-pointer"
            onClick={() => window.location.href = `https://www.codebility.tech/profiles/${admin.id}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex h-full w-full flex-col gap-4 rounded-lg">
                <div className="relative h-[250px] w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* Image */}
                    <div className="relative w-full h-full">
                        <Image
                            alt={`${admin.first_name} Avatar`}
                            src={admin.image_url || defaultImage}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            className="rounded-lg object-cover"
                            onLoad={() => setImageLoaded(true)}
                            onError={(e) => {
                                e.currentTarget.src = defaultImage;
                            }}
                        />
                    </div>

                    {/* Loading skeleton */}
                    {!imageLoaded && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg"
                            animate={{
                                backgroundPosition: ["200% 0", "-200% 0"],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{
                                backgroundSize: "200% 100%",
                            }}
                        />
                    )}
                </div>

                {/* Text content */}
                <motion.div 
                    className="flex w-full flex-col gap-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <p className="md:text-md text-sm text-white lg:text-lg font-medium">
                        {capitalizeWords(admin.first_name)}{" "}
                        {capitalizeWords(admin.last_name)}
                    </p>
                    <div className="min-h-[2.5rem]">
                        {admin.display_position ? (
                            <p className="text-gray-300 text-sm lg:text-base">
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