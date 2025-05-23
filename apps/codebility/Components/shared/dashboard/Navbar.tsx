"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import MobileNav from "@/Components/shared/dashboard/MobileNav";
import Theme from "@/Components/shared/dashboard/Theme";
import { defaultAvatar } from "@/public/assets/images";
import { IconDropdown, IconLogout, IconProfile } from "@/public/assets/svgs";
import { createClientClientComponent } from "@/utils/supabase/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

export const menuItems = [
  { href: "/settings", icon: IconProfile, label: "Settings" },
];

const Navbar = () => {
  const supabase = createClientClientComponent();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Error fetching user:", authError.message);
          return;
        }

        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from("codev")
            .select("*")
            .eq("id", user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError.message);
            return;
          }

          setUserData(profileData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up real-time subscription for user data changes
    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "codev",
          filter: `id=eq.${userData?.id}`,
        },
        (payload) => {
          setUserData(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <nav className="background-navbar fixed top-0 z-10 w-full shadow-sm">
      <div className="flex px-8">
        <div className="flex flex-1 items-center justify-end gap-6 p-4">
          <Theme />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none">
              <div className="hidden flex-col items-end md:flex">
                <p className="capitalize dark:text-white">
                  {userData?.first_name} {userData?.last_name}
                </p>
                <p className="text-gray text-sm">{userData?.email_address}</p>
              </div>
              <div className="from-violet relative size-[44px] rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover p-[1.5px]">
                <Image
                  alt="Avatar"
                  src={userData?.image_url ?? defaultAvatar}
                  fill
                  sizes="44px"
                  priority={true}
                  title={`${userData?.first_name}'s Avatar`}
                  className="rounded-full object-cover"
                />
              </div>
              <Image
                src={IconDropdown}
                alt="dropdown icon"
                className="h-5 invert dark:invert-0"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="dark:bg-dark-100 absolute -left-24 top-3 border-white dark:border-zinc-700 md:w-[200px]">
              {menuItems.map((item) => (
                <Link href={item.href} key={item.label}>
                  <DropdownMenuItem className="flex cursor-pointer items-center gap-6 p-3 px-5">
                    <Image
                      src={item.icon}
                      alt={`${item.label} icon`}
                      width={20}
                      height={20}
                      className="invert dark:invert-0"
                    />
                    {item.label}
                  </DropdownMenuItem>
                </Link>
              ))}

              <DropdownMenuSeparator className="dark:bg-zinc-800" />

              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation();
                  await signOut();
                }}
                className="flex cursor-pointer items-center gap-6 p-3 px-5"
              >
                <Image
                  src={IconLogout}
                  alt="Logout icon"
                  className="invert dark:invert-0"
                  width={20}
                  height={20}
                />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
