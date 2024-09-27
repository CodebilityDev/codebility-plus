"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/Components/shared/home/Logo";
import { Button } from "@/Components/ui/button";
import { navItems } from "@/constants";
import useChangeBgNavigation from "@/hooks/useChangeBgNavigation";
import { IconFourDotsMenu } from "@/public/assets/svgs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@codevs/ui/sheet";

const Navigation = () => {
  const { color } = useChangeBgNavigation();
  const [openSheet, setOpenSheet] = useState(false);
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed z-50 flex w-full items-center justify-center p-5 lg:px-12 ${color ? "bg-[#03030395]" : ""
          }`}
      >
        <div className="flex w-full  items-center justify-between">
          <Logo />

          <div className="flex gap-2 items-center">
            <Link href="/bookacall">
              <Button
                variant="purple"
                rounded="full"
                size="lg"
                className="hidden lg:block"
              >
                Let{`'`}s Connect
              </Button>
            </Link>
            <div className="hidden lg:block">
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" size="icon" className="focus-visible:ring-0 w-10 h-10 p-0">
                    {isOpen ? (
                      <ChevronUp className="text-white h-6 w-6" />
                    ) : (
                      <ChevronDown className="text-white h-6 w-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="border-darkgray bg-light-700/10  w-[120px] transition-none"
                  align="end"
                  sideOffset={15}
                >
                  <DropdownMenuItem className="focus:bg-[#9747FF] rounded-md"  >
                    <Link href="/authv2/sign-in" className="w-full text-white text-base">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-[#9747FF] rounded-md" >
                    <Link href="/authv2/sign-up" className="w-full text-white text-base">
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger>
                <IconFourDotsMenu className="lg:hidden" />
              </SheetTrigger>
              <SheetContent
                side="top"
                className="flex h-auto w-full flex-col items-center justify-center border-none bg-light-900 text-stone-900 dark:bg-stone-900 dark:text-white"
              >
                {navItems.map((item, index) => (
                  <Link
                    onClick={() => setOpenSheet(false)}
                    href={item.path}
                    key={item.id}
                    className={`w-full ${index === 3 ? "border-none" : "border-black-100 dark:border-light-900"}`}
                  >
                    <p className="w-full cursor-pointer px-2 py-3 text-center text-base">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
