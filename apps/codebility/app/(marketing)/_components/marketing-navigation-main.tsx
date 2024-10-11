"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/Components/shared/home/Logo";
import { Button } from "@/Components/ui/button";
import { navItems } from "@/constants";
import useChangeBgNavigation from "@/hooks/useChangeBgNavigation";
import { IconFourDotsMenu } from "@/public/assets/svgs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IconDropdown, IconLogout, IconProfile } from "@/public/assets/svgs";
import { Sheet, SheetContent, SheetTrigger } from "@codevs/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";


import { defaultAvatar } from "@/public/assets/images";
import useUser from "@/app/home/_hooks/use-user";
import { signOut } from "@/app/authv2/actions";
import MobileNav from "@/Components/shared/dashboard/MobileNav";
import Image from "next/image";

export const menuItems = [
  { href: "/settings", icon: IconProfile, label: "Settings" },
];


type NavigationMainProps = {
  isLoggedIn: boolean;
  first_name: string;
  last_name: string;
  image_url: string;
  email: string
};

const NavigationMain = ({ isLoggedIn, first_name, last_name, image_url, email}: NavigationMainProps) => {
  const { color } = useChangeBgNavigation();
  const [openSheet, setOpenSheet] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="flex w-full  items-center justify-between">
          <Logo />

          <div className="flex items-center gap-2">
            <Link href="/bookacall" className={`${isLoggedIn ? 'hidden' : 'lg:block' }`}>
              <Button
                variant="purple"
                rounded="full"
                size="lg"
                className="hidden lg:block"
              >
                Let{`'`}s Connect
              </Button>
            </Link>

            {isLoggedIn ? <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none">
                <div className="hidden flex-col items-end md:flex ">
                  <p className="capitalize dark:text-white">
                    {first_name} {last_name}
                  </p>
                  <p className="text-gray text-sm">{email}</p>
                </div>
                <div className="from-violet relative size-[44px] rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover p-[1.5px]">
                  <Image
                    alt="Avatar"
                    src={
                      image_url
                        ? `${image_url}`
                        : defaultAvatar
                    }
                    fill
                    title={`${first_name}'s Avatar`}
                    className="from-violet h-auto w-full rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover"
                    loading="eager"
                  />
                </div>
                <IconDropdown className="hidden invert dark:invert-0 md:block" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="dark:bg-dark-100 absolute -left-24 top-3 border-white dark:border-zinc-700 md:w-[200px]">
                {menuItems.map((item) => (
                  <Link href={item.href} key={item.label}>
                    <DropdownMenuItem className="flex cursor-pointer items-center gap-6 p-3 px-5">
                      <item.icon className="invert dark:invert-0" />
                      {item.label}
                    </DropdownMenuItem>
                  </Link>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={async (e) => {
                    e.stopPropagation();
                    await signOut();
                  }}
                  className="flex cursor-pointer items-center gap-6 p-3 px-5"
                >
                  <IconLogout className="invert dark:invert-0" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <div className="hidden lg:block">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
            </div>}
            
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger>
                <IconFourDotsMenu className="lg:hidden" />
              </SheetTrigger>
              <SheetContent
                side="left"
                aria-describedby={undefined}
                className="bg-black-900 flex h-full w-full flex-col justify-start border-none bg-stone-900 pt-20 text-white"
              >
                <SheetHeader className="hidden">
                  <SheetTitle>Sidebar</SheetTitle>
                </SheetHeader>
                {navItems.map((item, index) => {
                  if (isLoggedIn && index >= navItems.length - 2) {
                    return null;
                  }
                  return (
                    <Link
                      onClick={() => setOpenSheet(false)}
                      href={item.path}
                      key={item.id}
                    >
                      <p className="w-full cursor-pointer p-4 text-left text-xl font-semibold">
                        {item.title}
                      </p>
                    </Link>
                  );
                })}

                {isLoggedIn && (
                  <button
                    onClick={() => handleLogout()}
                    className="w-full cursor-pointer border-none p-4 text-left text-xl font-semibold"
                  >
                    Logout
                  </button>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationMain;
