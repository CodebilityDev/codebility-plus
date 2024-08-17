'use client'

import { createContext, useContext, useState } from 'react'
import { FormTargets } from '../_lib/builder-form-sidebar-items'
import { ProfileData } from '../_lib/builder-data-form-datas'
import { UserWorkspaceContext } from '../../_components/user-workspace-context'
import Card from '~/types/cards'

interface BuilderForm {
  current: FormTargets
  cardData: Card
  profileDatas: string
  updateProfileDatas: (datas: string) => void
  updateForm: (form: FormTargets) => void
}

export const BuilderFormContext = createContext<BuilderForm>({} as BuilderForm)

export default function BuilderFormProvider({
  children,
  cardData,
  builderProfileData,
}: {
  children: React.ReactNode
  cardData: Card
  builderProfileData: ProfileData
}) {
  const user = useContext(UserWorkspaceContext)
  const [currentForm, setCurrentForm] = useState<FormTargets>('data')

  const [profileDatas, setProfileDatas] = useState(
    JSON.stringify(builderProfileData),
  )

  function updateForm(form: FormTargets) {
    setCurrentForm(form)
  }

  function updateProfileDatas(datas: string) {
    const profileDataParsed = JSON.parse(profileDatas)
    URL.revokeObjectURL(profileDataParsed.coverPhoto)
    setProfileDatas(datas)
  }

  return (
    <BuilderFormContext.Provider
      value={{
        cardData,
        current: currentForm,
        updateForm,
        profileDatas,
        updateProfileDatas,
      }}
    >
      {children}
    </BuilderFormContext.Provider>
  )
}
