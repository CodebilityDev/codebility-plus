"use client";

import Link from "next/link";
import SettingsCard from "@/app/home/settings/_components/settings-card";
import { settingsCardData } from "@/app/home/settings/_lib/settings-data";
import { H1 } from "@/Components/shared/dashboard";
import useUser from "../_hooks/use-user";

const Settings = () => {
  const user = useUser();

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Settings</H1>
      <div className="grid w-full max-w-7xl grid-cols-1  gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {settingsCardData.map(
          ({ path, imageName, imageAlt, title, description }) => {
            const arr = path.split("/");
            const permissions = arr[arr.length - 1];
            const accessRoutes = user.permissions.includes(permissions as string);

            if (accessRoutes) {
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
