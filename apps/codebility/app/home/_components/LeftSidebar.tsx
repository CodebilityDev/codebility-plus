"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarData } from "@/constants/sidebar";
import { useNavStore } from "@/hooks/use-sidebar";
import { useUserStore } from "@/store/codev-store";
import { AnimatePresence, motion } from "framer-motion";

const LeftSidebar = () => {
  const { user } = useUserStore();
  const { isToggleOpen, toggleNav } = useNavStore();
  const pathname = usePathname();
  const [sidebarData, setSidebarData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      if (user?.role_id) {
        const data = await getSidebarData(user.role_id);
        setSidebarData(data);
      }
    };

    fetchSidebarData();
  }, [user?.role_id]);

  const sidebarVariants = {
    closed: {
      width: "5rem",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      width: "16rem",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.section
      initial={false}
      animate={isToggleOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="background-navbar sticky left-0 top-0 z-20  flex h-screen flex-col gap-8 overflow-hidden  p-1 shadow-lg max-lg:hidden lg:flex"
    >
      {/* Logo and Toggle Button */}
      <div className="mt-4 flex items-center justify-between ">
        <div className="flex w-full items-center">
          <Link href="/" className="flex-grow overflow-hidden">
            <AnimatePresence>
              {isToggleOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/assets/svgs/codebility-white.svg"
                    alt="Codebility White Logo"
                    width={180}
                    height={50}
                    className="hidden dark:block"
                  />
                  <Image
                    src="/assets/svgs/codebility-black.svg"
                    alt="Codebility Black Logo"
                    width={180}
                    height={50}
                    className="block dark:hidden"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <motion.button
          onClick={toggleNav}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <motion.div
            animate={{ rotate: isToggleOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: "30px", height: "30px" }}
          >
            <Image
              src="/assets/svgs/icon-codebility.svg"
              alt="Toggle Sidebar"
              width={50}
              height={50}
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Sidebar Links */}
      {sidebarData.map((section) => (
        <div key={section.id} className="mt-4 ">
          <AnimatePresence>
            {isToggleOpen ? (
              <motion.h4
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-gray ml-2 text-sm uppercase"
              >
                {section.title}
              </motion.h4>
            ) : (
              <div className="bg-dark300_light900 my-3  border-2" />
            )}
          </AnimatePresence>

          <div className="mt-3 flex flex-col gap-2">
            {section.links.map((link) => {
              const isActive = pathname === link.route;
              return (
                <Link
                  key={link.route}
                  href={link.route}
                  className={`${
                    isActive
                      ? "primary-gradient text-light-900 rounded-lg"
                      : "text-dark300_light900"
                  } mt-2 flex items-center gap-4 rounded-sm  px-4 py-4 transition duration-100 hover:bg-[#F5F5F5] dark:hover:bg-[#131417]`}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ width: "18px", height: "18px" }}
                  >
                    <Image
                      src={link.imgURL}
                      alt={link.label}
                      width={18}
                      height={18}
                      className={`${
                        isActive ? "" : "invert-colors"
                      } h-full w-full`}
                    />
                  </div>
                  <span
                    className={`${
                      isToggleOpen ? "block" : "hidden"
                    } transition-opacity duration-300`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </motion.section>
  );
};

export default LeftSidebar;
