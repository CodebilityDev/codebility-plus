'use client'

import { createContext, useState } from 'react'
import { FormTargets } from '../_lib/builder-form-sidebar-items'
import { profileDatasDefault } from '../_lib/builder-data-form-datas'

interface BuilderForm {
  current: FormTargets
  profileDatas: string
  updateProfileDatas: (datas: string) => void
  updateForm: (form: FormTargets) => void
}

export const BuilderFormContext = createContext<BuilderForm>({} as BuilderForm)

export default function BuilderFormProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentForm, setCurrentForm] = useState<FormTargets>('data')

  const [profileDatas, setProfileDatas] = useState(
    JSON.stringify(profileDatasDefault),
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
