"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // For getting the current route

import { signOut } from "@/app/auth/actions";
import Logo from "@/Components/shared/home/Logo";
import { Button } from "@/Components/ui/button";
import useChangeBgNavigation from "@/hooks/useChangeBgNavigation";
import { defaultAvatar } from "@/public/assets/images";
import {
  IconDashboard,
  IconFourDotsMenu,
  IconLogout,
  IconProfile,
} from "@/public/assets/svgs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Activity, ChevronDown, ChevronUp } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@codevs/ui/sheet";

// Navigation items for mobile drawer
const NAV_ITEMS = [
  { id: "1", title: "Our Services", path: "/services" },
  { id: "2", title: "About Us", path: "/#whychooseus" },
  { id: "3", title: "Book a Call", path: "/bookacall" },
  { id: "4", title: "Hire a CoDevs", path: "/codevs" },
] as const;

// Get menu items based on application status
const getMenuItems = (status: string) => {
  if (status === "rejected" || status === "applying") {
    return [
      {
        href: status === "rejected" ? "/auth/declined" : "/auth/waiting",
        icon: Activity,
        label: "Status",
      },
      { href: "/profile", icon: IconProfile, label: "Profile" },
    ];
  }
  return [
    { href: "/home", icon: IconDashboard, label: "Dashboard" },
    { href: "/home/account-settings", icon: IconProfile, label: "Settings" },
  ];
};

// Mobile Navigation Drawer Component
const MobileDrawer = ({
  isLoggedIn,
  openSheet,
  setOpenSheet,
  handleLogout,
}: {
  isLoggedIn: boolean;
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  handleLogout: () => void;
}) => (
  <Sheet open={openSheet} onOpenChange={setOpenSheet}>
    <SheetTrigger>
      <IconFourDotsMenu className="lg:hidden" />
    </SheetTrigger>
    <SheetContent
      side="left"
      className="bg-black-900 flex h-full w-full flex-col justify-start border-none bg-stone-900 pt-20 text-white"
    >
      {NAV_ITEMS.map((item) => {
        if (isLoggedIn && ["Sign In", "Sign Up"].includes(item.title)) {
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
          onClick={handleLogout}
          className="w-full cursor-pointer border-none p-4 text-left text-xl font-semibold"
        >
          Logout
        </button>
      )}
    </SheetContent>
  </Sheet>
);

// User Menu Component
const UserMenu = ({
  first_name,
  last_name,
  email,
  image_url,
  application_status,
  handleLogout,
}: {
  first_name: string;
  last_name: string;
  email: string;
  image_url: string;
  application_status: string;
  handleLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none">
        <div className="hidden flex-col items-end md:flex">
          <p className="capitalize text-white">
            {first_name} {last_name}
          </p>
          <p className="text-gray text-sm">{email}</p>
        </div>
        <div className="from-violet relative size-[44px] rounded-full bg-gradient-to-b to-blue-500 p-[1.5px]">
          <Image
            alt="Avatar"
            src={image_url || defaultAvatar}
            fill
            sizes="44px"
            title={`${first_name}'s Avatar`}
            className="rounded-full object-cover"
          />
        </div>
        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-white" />
        ) : (
          <ChevronDown className="h-6 w-6 text-white" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-dark-100 bg-dark-100 absolute -left-24 top-3 border-zinc-700 md:w-[200px]">
        {getMenuItems(application_status).map((item) => (
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

// Main Navigation Component
const Navigation = () => {
  const supabase = createClientComponentClient();
  const { color } = useChangeBgNavigation();
  const pathname = usePathname(); // Get current route
  const [openSheet, setOpenSheet] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data } = await supabase
            .from("codev")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await signOut();
      setOpenSheet(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (isLoading) return null;

  return (
    <div
      className={`fixed z-50 flex w-full items-center justify-center p-5 lg:px-12 ${
        color ? "bg-[#03030395]" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileDrawer
            isLoggedIn={!!userData}
            openSheet={openSheet}
            setOpenSheet={setOpenSheet}
            handleLogout={handleLogout}
          />
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          {!userData ? (
            <>
              {/* Show "Sign In" button on the /codev route */}

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

              {pathname === "/codevs" && (
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
              )}
            </>
          ) : (
            <UserMenu {...userData} handleLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
