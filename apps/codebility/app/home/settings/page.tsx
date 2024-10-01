"use client";

import Link from "next/link";
import SettingsCard from "@/app/home/settings/_components/settings-card";
import { settingsCardData } from "@/app/home/settings/_lib/settings-data";
import { H1 } from "@/Components/shared/dashboard";
import useAuthCookie from "@/hooks/use-cookie";

const Settings = () => {
  const auth = useAuthCookie();

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Settings</H1>
      <div className="grid w-full max-w-7xl grid-cols-1  gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {settingsCardData.map(
          ({ path, imageName, imageAlt, title, description }) => {
            const accessRoutes =
              (auth?.data?.userType.name === "USER" &&
                path === "/home/settings/resume") ||
              (auth?.data?.userType.name === "ADMIN" &&
                path === "/home/settings/resume") ||
              (auth?.data?.userType.roles === true &&
                path === "/home/settings/roles") ||
              (auth?.data?.userType.permissions === true &&
                path === "/home/settings/permissions") ||
              (auth?.data?.userType.services === true &&
                path === "/home/settings/services");

            if (!accessRoutes || accessRoutes) {
              return (
                <Link key={path} href={path}>
                  <SettingsCard
                    imageName={imageName}
                    imageAlt={imageAlt}
                    title={title}
                    description={description}
                  />
                </Link>
              );
            }
          },
        )}
      </div>
    </div>
  );
};

export default Settings;
