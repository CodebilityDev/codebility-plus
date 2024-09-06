"use client";

import { createContext, useContext, useState } from "react";

import { ManageProfileData } from "~/lib/profile-data";

interface Profile {
  profileDatas: string;
  updateProfileDatas: (datas: string) => void;
}

export const ProfileContext = createContext<Profile>({} as Profile);

export default function ProfileContextProvider({
  children,
  manageProfileData,
}: {
  children: React.ReactNode;
  manageProfileData: ManageProfileData;
}) {
  // transform null property values to empty string.
  const manageProfileDataKeys = Object.keys(manageProfileData);

  for (let profileKey of manageProfileDataKeys) {
    const key = profileKey as keyof ManageProfileData;
    if (!manageProfileData[key]) manageProfileData[key] = "";
  }

  const [profileDatas, setProfileDatas] = useState(
    JSON.stringify(manageProfileData),
  );

  function updateProfileDatas(datas: string) {
    const profileDataParsed = JSON.parse(profileDatas);
    URL.revokeObjectURL(profileDataParsed.coverPhoto);
    setProfileDatas(datas);
  }

  return (
    <ProfileContext.Provider value={{ profileDatas, updateProfileDatas }}>
      {children}
    </ProfileContext.Provider>
  );
}
