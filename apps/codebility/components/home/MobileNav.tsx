"use client";


import Image from "next/image";
import Link from "next/link";


import useHideSidebarOnResize from "@/hooks/home/useHideSidebarOnResize";


import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@codevs/ui/sheet";
import { NavContent } from "@/components/home/NavContent";


const MobileNav = () => {
  const { isSheetOpen, setIsSheetOpen } = useHideSidebarOnResize();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <button
          className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-customBlue-500 focus:ring-offset-2 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={isSheetOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsSheetOpen(true)}
        >
          <Image
            src="/assets/svgs/icon-hamburger.svg"
            width={20}
            height={20}
            alt=""
            className="invert dark:invert-0"
            aria-hidden="true"
          />
          <span className="sr-only">Open mobile navigation menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        id="mobile-navigation"
        side="left"
        className="overflow-y-auto bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Navigation Menu</SheetTitle>
          <SheetDescription>
            Navigate through the application pages using the links below
          </SheetDescription>
        </SheetHeader>
        <div className="mb-4">
          <Link
            href="/"
            className="flex items-center gap-1"
            aria-label="Go to homepage"
          >
            <Image
              src="/assets/svgs/codebility-violet.svg"
              width={147}
              height={30}
              alt="Codebility"
            />
          </Link>
        </div>
        <div>
          <NavContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;