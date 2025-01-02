import React from "react";
import Link from "next/link";
import { navItems } from "@/constants";
import { IconFourDotsMenu } from "@/public/assets/svgs";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui/sheet";

export default function MarketingNavigationMobileDrawer({
  isLoggedIn,
  openSheet,
  setOpenSheet,
  handleLogout,
}: {
  isLoggedIn: boolean;
  openSheet: boolean;
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}) {
  return (
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
  );
}
