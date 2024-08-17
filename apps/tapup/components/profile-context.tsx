'use client'

import { createContext, useContext, useState } from 'react'
import { ManageProfileData } from '~/lib/profile-data'

interface Profile {
  profileDatas: string
  updateProfileDatas: (datas: string) => void
}

export const ProfileContext = createContext<Profile>({} as Profile)

export default function ProfileContextProvider({
  children,
  manageProfileData,
}: {
  children: React.ReactNode
  manageProfileData: ManageProfileData
}) {
  const [profileDatas, setProfileDatas] = useState(
    JSON.stringify(manageProfileData),
  )

  function updateProfileDatas(datas: string) {
    const profileDataParsed = JSON.parse(profileDatas)
    URL.revokeObjectURL(profileDataParsed.coverPhoto)
    setProfileDatas(datas)
  }

  return (
    <ProfileContext.Provider value={{ profileDatas, updateProfileDatas }}>
      {children}
    </ProfileContext.Provider>
  )
}
