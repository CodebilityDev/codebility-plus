"use client";

import Link from "next/link";
import SettingsCard from "@/app/home/settings/_components/settings-card";
import { H1 } from "@/Components/shared/dashboard";
import { settingsCardData } from "@/constants/settings";

const Settings = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Settings</H1>
      <div className="grid w-full max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {settingsCardData.map((card) => (
          <Link key={card.path} href={card.path}>
            <SettingsCard
              imageName={card.imageName}
              imageAlt={card.imageAlt}
              title={card.title}
              description={card.description}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Settings;
