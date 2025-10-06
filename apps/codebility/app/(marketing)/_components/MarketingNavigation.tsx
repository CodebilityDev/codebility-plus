"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import Logo from "@/components/shared/home/Logo";
import { Button } from "@/components/ui/button";
import useChangeBgNavigation from "@/hooks/useChangeBgNavigation";
import { defaultAvatar } from "@/public/assets/images";
import {
  IconCog,
  IconDashboard,
  IconFourDotsMenu,
  IconLogout,
  IconProfile,
} from "@/public/assets/svgs";
import applicationStatusIcon from "@/public/assets/svgs/icon-applicant.svg";
import { createClientClientComponent } from "@/utils/supabase/client";
import { ChevronDown, ChevronUp, SettingsIcon } from "lucide-react";

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
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui/sheet";

const NAV_ITEMS = [
  { id: "1", title: "Our Services", path: "/services" },
  { id: "2", title: "About Us", path: "/#whychooseus" },
  { id: "3", title: "Book a Call", path: "/bookacall" },
  { id: "4", title: "Hire a CoDevs", path: "/hire-a-codev" },
] as const;

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

const MobileDrawer = ({
  isLoggedIn,
  openSheet,
  setOpenSheet,
  handleLogout,
  userData,
}: {
  isLoggedIn: boolean;
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  handleLogout: () => void;
  userData?: {
    application_status: string;
    role_id: number;
    applicant: {
      id: string;
      codev_id: string;
    } | null;
  } | null;
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
      
      {/* User menu items */}
      {isLoggedIn && userData && (
        <>
          <div className="border-t border-zinc-700 my-2" />
          {getMenuItems(userData.application_status, userData.role_id, userData.applicant).map((item) => (
            <Link
              onClick={() => setOpenSheet(false)}
              href={item.href}
              key={item.label}
            >
              <div className="flex items-center gap-4 p-4 text-left text-xl font-semibold">
                <item.icon className="h-6 w-6" style={{ color: "#ffffff" }} />
                {item.label}
              </div>
            </Link>
          ))}
          <div className="border-t border-zinc-700 my-2" />
        </>
      )}
      
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full cursor-pointer border-none p-4 text-left text-xl font-semibold"
        >
          <IconLogout className="h-6 w-6 text-white" />
          Logout
        </button>
      )}
    </SheetContent>
  </Sheet>
);

const UserMenu = ({
  first_name,
  last_name,
  email,
  image_url,
  application_status,
  role_id,
  applicant,
  handleLogout,
}: {
  first_name: string;
  last_name: string;
  email: string;
  image_url: string;
  application_status: string;
  role_id: number;
  applicant: {
    id: string;
    codev_id: string;
  } | null;
  handleLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

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

const Navigation = () => {
  const { color } = useChangeBgNavigation();
  const pathname = usePathname();
  const [openSheet, setOpenSheet] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    async function fetchUser() {
      try {
        // FIXED: Use getUser() instead of getSession()
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.log("Auth error:", authError.message);
          setUserData(null);
          return;
        }

        if (!user) {
          // not logged in → silent
          setUserData(null);
          return;
        }

        const { data: userRow, error: fetchError } = await supabase
          .from("codev")
          .select(`*, applicant (id, codev_id)`)
          .eq("id", user.id)
          .single();

        console.log("User Row:", userRow);

        if (fetchError) {
          console.error("Error fetching codev:", fetchError.message);
          setUserData(null);
        } else {
          setUserData(userRow);
        }
      } catch (err) {
        console.error("Unexpected error fetching user data:", err);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await signOut();
      setUserData(null); // Clear userData after logout
      setOpenSheet(false); // Close the mobile drawer (if open)
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (isLoading) return null;

  return (
    <div
      className={`fixed z-50 flex w-full items-center justify-center p-5 lg:px-12 ${
        color ? "bg-dark-500/55" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center gap-4">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          {!userData ? (
            <>
              {pathname === "/careers" && (
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
        <MobileDrawer
          isLoggedIn={!!userData}
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          handleLogout={handleLogout}
          userData={userData}
        />
      </div>
    </div>
  );
};

export default Navigation;