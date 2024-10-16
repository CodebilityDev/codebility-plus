/* eslint-disable no-unused-vars */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarData } from "@/constants";
import { useNavStore } from "@/hooks/use-sidebar";

import useUser from "../_hooks/use-user";

const LeftSidebar = () => {
  const user = useUser();
  const { isToggleOpen, toggleNav } = useNavStore();
  const pathname = usePathname();

  return (
    <section className="background-navbar sticky left-0 top-0 z-20 hidden h-screen flex-col gap-14 p-6 shadow-lg max-lg:hidden lg:flex">
      <div className="flex justify-stretch gap-4 max-lg:hidden">
        <div
          className={`transition-all ${!isToggleOpen ? "flex-0" : "flex-1"} flex overflow-hidden`}
        >
          <Link href="/">
            <Image
              src="/assets/svgs/codebility-white.svg"
              width={147}
              height={30}
              alt="Codebility white logo"
              className={`hidden h-[40px] transition-all dark:block ${!isToggleOpen && "w-0"}`}
            />
            <Image
              src="/assets/svgs/codebility-black.svg"
              width={147}
              height={30}
              alt="Codebility black logo"
              className={`h-[40px] transition-all dark:hidden ${!isToggleOpen && "w-0"}`}
            />
          </Link>
        </div>

        <Image
          onClick={() => toggleNav()}
          src="/assets/svgs/icon-codebility.svg"
          width={30}
          height={40}
          alt="logo"
          className={`toggle-logo-btn ${isToggleOpen ? "close-nav" : "open-nav mx-auto"}`}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto max-lg:hidden">
        {sidebarData.map((item) => {
          const hasPermission = item.links.some((link) =>
            user.permissions.includes(link.permission),
          );

          if (user.application_status !== "ACCEPTED") return null

          return (
            <div
              key={item.id}
              className={`${!hasPermission ? "hidden" : "block"} ${!isToggleOpen ? "mt-0" : "mt-5"}`}
            >
              <h4
                className={`text-gray text-sm uppercase ${!isToggleOpen || !hasPermission ? "hidden" : "block"}`}
              >
                {item.title}
              </h4>
              <div
                className={`${!isToggleOpen ? "mt-0" : "mt-3"} flex flex-1 flex-col gap-2 max-lg:hidden`}
              >
                {item.links.map((link) => {
                  const accessRoutes = user.permissions.includes(
                    link.permission,
                  );
                  const isActive = pathname === link.route;

                  if (accessRoutes) {
                    return (
                      <Link
                        href={link.route}
                        key={link.label}
                        className={`${
                          isActive
                            ? "primary-gradient text-light-900 rounded-lg"
                            : "text-dark300_light900"
                        } flex items-center justify-start gap-4 rounded-sm bg-transparent px-4 py-3 duration-100 hover:bg-[#F5F5F5] dark:hover:bg-[#131417]`}
                      >
                        <Image
                          src={link.imgURL}
                          alt={link.label}
                          width={18}
                          height={18}
                          className={`${isActive ? "" : "invert-colors"} h-[18px] w-[18px]`}
                        />
                        <p className={`${isToggleOpen ? "block" : "hidden"}`}>
                          {link.label}
                        </p>
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default LeftSidebar;
