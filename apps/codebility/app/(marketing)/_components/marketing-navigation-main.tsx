"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/authv2/actions";
import Logo from "@/Components/shared/home/Logo";
import { Button } from "@/Components/ui/button";
import { navItems } from "@/constants";
import useChangeBgNavigation from "@/hooks/useChangeBgNavigation";
import { defaultAvatar } from "@/public/assets/images";
import {
  IconDashboard,
  IconFourDotsMenu,
  IconLogout,
  IconProfile,
} from "@/public/assets/svgs";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui/sheet";

import MarketingNavigationMobileDrawer from "./marketing-navigation-mobile-drawer";

export const menuItems = [
  { href: "home", icon: IconDashboard, label: "Dashboard" },
  { href: "home/account-settings", icon: IconProfile, label: "Settings" },
];

type NavigationMainProps = {
  isLoggedIn: boolean;
  first_name: string;
  last_name: string;
  image_url: string;
  email: string;
};

const NavigationMain = ({
  isLoggedIn,
  first_name,
  last_name,
  image_url,
  email,
}: NavigationMainProps) => {
  const { color } = useChangeBgNavigation();
  const [openSheet, setOpenSheet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null); // State for hover

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setOpenSheet(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
    setOpenSheet(false);
  };

  useEffect(() => {
    console.log("NavigationMain mounted, isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <div
        className={`fixed z-50 flex w-full items-center justify-center p-5 lg:px-12 ${
          color ? "bg-[#03030395]" : ""
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <MarketingNavigationMobileDrawer
              isLoggedIn={isLoggedIn}
              openSheet={openSheet}
              setOpenSheet={setOpenSheet}
              handleLogout={handleLogout}
            />
            <Logo />
          </div>

          <div className="flex items-center gap-2">
            {!isLoggedIn && (
              <Link href="/bookacall">
                <Button
                  variant="purple"
                  rounded="full"
                  size="lg"
                  className="hidden lg:block"
                >
                  Let&apos;s Connect
                </Button>
              </Link>
            )}

            {isLoggedIn ? (
              <DropdownMenu
                open={isOpen}
                onOpenChange={setIsOpen}
                modal={false}
              >
                <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none">
                  <div className="hidden flex-col items-end md:flex ">
                    <p className="capitalize text-white dark:text-white">
                      {first_name} {last_name}
                    </p>
                    <p className="text-gray text-sm">{email}</p>
                  </div>
                  <div className="from-violet relative size-[44px] rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover p-[1.5px]">
                    <Image
                      alt="Avatar"
                      src={image_url ? `${image_url}` : defaultAvatar}
                      fill
                      sizes="44px"
                      title={`${first_name}'s Avatar`}
                      className="from-violet h-auto w-full rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover"
                      loading="eager"
                    />
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-6 w-6 text-white" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-white" />
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent className="dark:bg-dark-100 bg-dark-100 absolute -left-24 top-3 border-zinc-700 dark:border-zinc-700 md:w-[200px]">
                  {menuItems.map((item) => (
                    <Link
                      href={item.href}
                      key={item.label}
                      className="dark:bg-dark-100 bg-dark-100"
                    >
                      <DropdownMenuItem
                        className="flex cursor-pointer items-center gap-6 p-3 px-5"
                        id={item.label}
                        style={{
                          backgroundColor:
                            isHovered === item.label
                              ? "#292524"
                              : "transparent", // Change to hover color
                          color: "#ffffff", // Text color remains white
                        }}
                        onMouseEnter={() => setIsHovered(item.label)} // Mouse enters, set hover state to true
                        onMouseLeave={() => setIsHovered(null)} // Mouse leaves, set hover state to false
                      >
                        <item.icon style={{ color: "#ffffff" }} />{" "}
                        {/* Explicit icon color */}
                        {item.label}
                      </DropdownMenuItem>
                    </Link>
                  ))}

                  <DropdownMenuSeparator className="bg-zinc-800" />

                  <DropdownMenuItem
                    onClick={async (e) => {
                      e.stopPropagation();
                      await signOut();
                    }}
                    className="flex cursor-pointer items-center gap-6 p-3 px-5 text-white"
                    id="logout"
                    style={{
                      backgroundColor:
                        isHovered === "logout" ? "#292524" : "transparent", // Change to hover color
                      color: "#ffffff", // Text color remains white
                    }}
                    onMouseEnter={() => setIsHovered("logout")} // Mouse enters, set hover state to true
                    onMouseLeave={() => setIsHovered(null)} // Mouse leaves, set hover state to false
                  >
                    <IconLogout className="bg:bg-zinc-800 text-white" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:block">
                <DropdownMenu
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  modal={false}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="link"
                      size="icon"
                      className="h-10 w-10 p-0 focus-visible:ring-0"
                    >
                      {isOpen ? (
                        <ChevronUp className="h-6 w-6 text-white" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-white" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="border-darkgray bg-light-700/10  w-[120px] transition-none"
                    align="end"
                    sideOffset={15}
                  >
                    {isLoggedIn ? (
                      <DropdownMenuItem className="rounded-md focus:bg-[#9747FF]">
                        <Link
                          href="#"
                          onClick={handleLogout}
                          className="w-full text-base text-white"
                        >
                          Logout
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem className="rounded-md focus:bg-[#9747FF]">
                          <Link
                            href="/authv2/sign-in"
                            className="w-full text-base text-white"
                          >
                            Sign In
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-md focus:bg-[#9747FF]">
                          <Link
                            href="/authv2/sign-up"
                            className="w-full text-base text-white"
                          >
                            Sign Up
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationMain;
