"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/Components/shared/home/Logo";
import { Button } from "@/Components/ui/button";
import { navItems } from "@/constants";
import useChangeBgNavigation from "@/hooks/useChangeBgNavigation";
import { IconFourDotsMenu } from "@/public/assets/svgs";

import { Sheet, SheetContent, SheetTrigger } from "@codevs/ui/sheet";

const Navigation = () => {
  const { color } = useChangeBgNavigation();
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <>
      <div
        className={`fixed z-50 flex w-full items-center justify-center p-5 lg:px-12 ${color ? "bg-[#03030395]" : ""
          }`}
      >
        <div className="flex w-full max-w-screen-2xl items-center justify-between">
          <Logo />

          <div className="flex items-center">
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

            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger>
                <IconFourDotsMenu className="lg:hidden" />
              </SheetTrigger>
              <SheetContent
                side="top"
                className="flex h-96 w-full flex-col items-center justify-center border-none text-white"
              >
                {navItems.map((item, index) => (
                  <Link
                    onClick={() => setOpenSheet(false)}
                    href={item.path}
                    key={item.id}
                    className={`w-full ${index === 3 ? "border-none" : "border-black-100 border-b"}`}
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
