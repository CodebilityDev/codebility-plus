"use client";

import { NAV_ITEMS } from "@/constants/global/marketing";
import { IconFourDotsMenu } from "@/public/assets/svgs/index";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@codevs/ui";
import Link from "next/link";
import type { MobileDrawerProps } from "@/types/global/marketing";

export const MobileDrawer = ({
  openSheet,
  setOpenSheet,
  drawerAuth,
}: MobileDrawerProps) => (
  <Sheet open={openSheet} onOpenChange={setOpenSheet}>
    <SheetTrigger>
      <IconFourDotsMenu className="lg:hidden" />
    </SheetTrigger>
    <SheetContent
      side="left"
      className="bg-black-900 flex h-full w-full flex-col justify-start border-none bg-stone-900 pt-20 text-white"
    >
      <SheetTitle className="sr-only">Mobile Navbar</SheetTitle>
      <SheetDescription className="sr-only">
        Navbar that contains links
      </SheetDescription>
      {NAV_ITEMS.map((item) => (
        <Link
          onClick={() => setOpenSheet(false)}
          href={item.path}
          key={item.id}
        >
          <p className="w-full cursor-pointer p-4 text-left text-xl font-semibold">
            {item.title}
          </p>
        </Link>
      ))}
      <div
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a, button")) {
            setOpenSheet(false);
          }
        }}
      >
        {drawerAuth}
      </div>
    </SheetContent>
  </Sheet>
);
