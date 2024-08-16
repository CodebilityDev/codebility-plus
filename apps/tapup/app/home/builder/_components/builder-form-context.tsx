'use client'

import { createContext, useContext, useState } from 'react'
import { FormTargets } from '../_lib/builder-form-sidebar-items'
import { profileDatasDefault } from '../_lib/builder-data-form-datas'
import { UserWorkspaceContext } from '../../(user)/_components/user-workspace-context'
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
}: {
  children: React.ReactNode
  cardData: Card
}) {
  const user = useContext(UserWorkspaceContext)
  const [currentForm, setCurrentForm] = useState<FormTargets>('data')

  const [profileDatas, setProfileDatas] = useState(
    JSON.stringify(
      Object.assign(profileDatasDefault, {
        businessEmail: user.email,
        businessIndustry: cardData.industry,
        name: cardData.name,
      }),
    ),
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
