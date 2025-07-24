"use client";

import { useEffect, useState, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarData } from "@/constants/sidebar";
import { useNavStore } from "@/hooks/use-sidebar";
import { useUserStore } from "@/store/codev-store";
import { useSidebarStore } from "@/store/sidebar-store";
import { AnimatePresence, motion } from "framer-motion";

interface SidebarLink {
  route: string;
  label: string;
  imgURL: string;
}

interface SidebarSection {
  id: string;
  title: string;
  links: SidebarLink[];
}

const LeftSidebar = () => {
  const { user } = useUserStore();
  const { isToggleOpen, toggleNav } = useNavStore();
  const pathname = usePathname();
  const [sidebarData, setSidebarData] = useState<any[]>([]);
  const refreshKey = useSidebarStore((state) => state.refreshKey);

  const roleId = useMemo(() => {
    if (!user?.role_id) return null;
    return user.internal_status == "INACTIVE" || user.availability_status == false
      ? 11
      : user.role_id;
  }, [user?.role_id, user?.internal_status, user?.availability_status]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      if (roleId) {
        const data = await getSidebarData(roleId);
        setSidebarData(data);
      }
    };

    fetchSidebarData();
  }, [roleId, refreshKey]);

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
    <motion.aside
      initial={false}
      animate={isToggleOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="background-navbar sticky left-0 top-0 z-20 hidden h-screen flex-col gap-8 overflow-hidden p-1 shadow-lg lg:flex"
      role="complementary"
      aria-label="Main navigation sidebar"
    >
      {/* Logo and Toggle Button */}
      <div className="mt-4 flex items-center justify-between">
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
          className="p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label={isToggleOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isToggleOpen}
          aria-controls="sidebar-navigation"
        >
          <motion.div
            animate={{ rotate: isToggleOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: "30px", height: "30px" }}
          >
            <Image
              src="/assets/svgs/icon-codebility.svg"
              alt=""
              width={50}
              height={50}
              style={{ width: "100%", height: "100%" }}
              aria-hidden="true"
            />
          </motion.div>
          <span className="sr-only">
            {isToggleOpen ? "Collapse" : "Expand"} navigation sidebar
          </span>
        </motion.button>
      </div>

      {/* Sidebar Links */}
      <nav 
        id="sidebar-navigation"
        className="flex flex-col overflow-y-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        {sidebarData.map((section: SidebarSection) => (
          <div key={section.id} role="group" aria-labelledby={`sidebar-section-${section.id}`}>
            <AnimatePresence>
              {isToggleOpen ? (
                <motion.h4
                  id={`sidebar-section-${section.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray ml-2 text-sm uppercase mt-4"
                >
                  {section.title}
                </motion.h4>
              ) : (
                <div 
                  className="bg-dark300_light900 my-3 border-2" 
                  role="separator"
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>

            <ul className="mt-3 flex flex-col gap-2" role="list">
              {section.links.map((link: SidebarLink) => {
                const isActive =
                  link.route === "/home"
                    ? pathname === "/home"
                    : pathname.startsWith(link.route);

                return (
                  <li key={link.route} role="none">
                    <Link
                      href={link.route}
                      className={`${
                        isActive
                          ? "primary-gradient text-light-900 rounded-lg"
                          : "text-dark300_light900"
                      } mt-2 flex items-center gap-4 rounded-sm px-4 py-4 transition duration-100 hover:bg-[#F5F5F5] dark:hover:bg-[#131417] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`Navigate to ${link.label}${isActive ? " (current page)" : ""}`}
                      title={!isToggleOpen ? link.label : undefined}
                    >
                      <div
                        className="flex items-center justify-center"
                        style={{ width: "18px", height: "18px" }}
                      >
                        <Image
                          src={link.imgURL}
                          alt=""
                          width={28}
                          height={28}
                          className={`${isActive ? "" : "invert-colors"} h-full w-full`}
                          aria-hidden="true"
                        />
                      </div>
                      <span
                        className={`${
                          isToggleOpen ? "block" : "hidden"
                        } transition-opacity duration-300`}
                      >
                        {link.label}
                      </span>
                      {!isToggleOpen && (
                        <span className="sr-only">{link.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default memo(LeftSidebar);
