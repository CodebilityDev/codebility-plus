'use client'

import { createContext, useState } from 'react'
import { FormTargets } from '../_lib/builder-form-sidebar-items'

interface BuilderForm {
  current: FormTargets
  profileDatas: string
  updateProfileDatas: (datas: string) => void
  updateForm: (form: FormTargets) => void
}

const profileDatasDefault = {
  name: 'Highland Bali',
  coverPhoto: '',
  businessEmail: '',
  businessContact: '',
  businessIndustry: 'Telecommunication',
  industryRole: 'CEO',
  bio: 'A ball is a round object (usually spherical, but can sometimes be ovoid) with several uses. It is used in ball games, where the play of the game follows the state of the ball as it is hit, kicked or thrown by players',
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
