"use client";

import React, { useState, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

import { defaultAvatar } from "@/public/assets/images";
import {
  IconCog,
  IconDashboard,
  IconFourDotsMenu,
  IconLogout,
  IconProfile,
} from "@/public/assets/svgs";
import applicationStatusIcon from "@/public/assets/svgs/icon-applicant.svg";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui";
import { createClientClientComponent } from "@/utils/supabase/client";
import { setLocalStorageValue, useLocalStorageValue } from "@/hooks/useLocalStorageValue";
import { NavUserProfile } from "@/types/database";

// Navigation items for top navbar and mobile drawer
const NAV_ITEMS = [
  { id: "1", title: "Our Services", path: "/services" },
  { id: "2", title: "About Us", path: "/#whychooseus" },
  { id: "3", title: "Book a Call", path: "/bookacall" },
  { id: "4", title: "Be a Codev", path: "/codevs" }, // ✅ ADDED: New link after Book a Call
  { id: "5", title: "Hire a CoDevs", path: "/hire-a-codev" },
] as const;

const NAV_USER_PROFILE_KEY = "user_profile";

async function getNavUser() {
  const supabase = createClientClientComponent();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
      .from("codev")
      .select(`*, applicant (id, codev_id)`)
      .eq("id", user.id)
      .single();

  if (!profile) return null;

  const cleanUserData = {
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email_address,
    image_url: profile.image_url,
    application_status: profile.application_status,
    role_id: profile.role_id,
    applicant: profile.applicant ?? null,
  };

  if (typeof window !== "undefined") {
    setLocalStorageValue(NAV_USER_PROFILE_KEY, cleanUserData);
  }

  return cleanUserData;
}


let navUserPromise: ReturnType<typeof getNavUser> | null = null;

function getNavUserPromise() {
  if (!navUserPromise) navUserPromise = getNavUser()
  return navUserPromise;
}

// Get menu items based on user application status
const getMenuItems = (
  status: string,
  role_id: number,
  applicant: {
    id: string;
    codev_id: string;
  } | null,
) => {
  if (
    status === "rejected" ||
    status === "applying" ||
    status === "testing" ||
    status === "onboarding" ||
    status === "denied"
  ) {
    return [
      {
        href:
          status === "rejected" || status === "denied"
            ? "/auth/declined"
            : applicant?.id
              ? "/applicant/waiting"
              : "/auth/waiting",
        icon: applicationStatusIcon,
        label: "Status",
      },
      {
        href: "/applicant/account-settings",
        icon: IconCog,
        label: "Settings",
      },
      { href: "/applicant/profile", icon: IconProfile, label: "Profile" },
    ];
  }
  return [
    { href: "/home", icon: IconDashboard, label: "Dashboard" },
    { href: "/home/settings/profile", icon: IconProfile, label: "Profile" },
  ];
};

export const DrawerAuthSection = ({handleLogout}: {handleLogout: () => void}) =>
   { 
    const cachedUserData = useLocalStorageValue<NavUserProfile>(NAV_USER_PROFILE_KEY);

    const userPromise = useMemo(() => {
      if (cachedUserData) {
        return Promise.resolve(cachedUserData);
      }
      return getNavUserPromise();
    }, [cachedUserData]);

    const userData = use(userPromise)

    if (!userData) return null;
    
    return (
  <>
    <div className="border-t border-zinc-700 my-2" />
    {getMenuItems(
      userData.application_status,
      userData.role_id,
      userData.applicant,
    ).map((item) => (
      <Link href={item.href} key={item.label}>
        <div className="flex items-center gap-4 p-4 text-left text-xl font-semibold">
          <item.icon className="h-6 w-6" style={{ color: "#ffffff" }} />
          {item.label}
        </div>
      </Link>
    ))}
    <div className="border-t border-zinc-700 my-2" />
    <button
      onClick={handleLogout}
      className="flex items-center gap-4 w-full cursor-pointer border-none p-4 text-left text-xl font-semibold"
    >
      <IconLogout className="h-6 w-6 text-white" />
      Logout
    </button>
  </>
)};

export const MobileDrawer = ({
  openSheet,
  setOpenSheet,
  drawerAuth,
}: {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  drawerAuth?: React.ReactNode;
}) => (
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

export const CareersSignIn = () => {
  const pathname = usePathname();
  if (pathname !== "/careers") return null;
  return (
    <Link href="/auth/sign-in">
      <Button
        variant="default"
        rounded="full"
        size="lg"
        className="hidden lg:block"
      >
        Sign In
      </Button>
    </Link>
  );
};

export const UserMenu = ({handleLogout}: {handleLogout: () => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const cachedUserData = useLocalStorageValue<NavUserProfile>(NAV_USER_PROFILE_KEY);

  const userPromise = useMemo(() => {
      if (cachedUserData) {
        return Promise.resolve(cachedUserData);
      }
      return getNavUserPromise();
    }, [cachedUserData]);

  const userData = use(userPromise)

  if (!userData) return <CareersSignIn />;

  const {first_name, last_name, email, image_url, application_status, role_id, applicant } = userData

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger className="hidden items-center gap-4 focus:outline-none lg:flex">
        <div className="flex-col items-end lg:flex">
          <p className="capitalize text-white">
            {first_name} {last_name}
          </p>
          <p className="text-white text-sm">{email}</p>
        </div>
        <div className="from-customViolet-300 relative overflow-hidden rounded-full bg-gradient-to-b to-customBlue-500 lg:h-[44px] lg:w-[52px]">
          <Image
            alt="Avatar"
            src={image_url || defaultAvatar}
            fill
            sizes="52px"
            title={`${first_name}'s Avatar`}
            className="rounded-full"
          />
        </div>

        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-white" />
        ) : (
          <ChevronDown className="h-6 w-6 text-white" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-dark-100 bg-dark-100 absolute -left-24 top-3 border-zinc-700 md:w-[200px]">
        {getMenuItems(application_status, role_id, applicant).map((item) => (
          <Link key={item.label} href={item.href}>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-6 p-3 px-5"
              style={{
                backgroundColor:
                  isHovered === item.label ? "#292524" : "transparent",
                color: "#ffffff",
              }}
              onMouseEnter={() => setIsHovered(item.label)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <item.icon style={{ color: "#ffffff" }} />
              {item.label}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-6 p-3 px-5 text-white"
          style={{
            backgroundColor: isHovered === "logout" ? "#292524" : "transparent",
          }}
          onMouseEnter={() => setIsHovered("logout")}
          onMouseLeave={() => setIsHovered(null)}
        >
          <IconLogout className="text-white" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};