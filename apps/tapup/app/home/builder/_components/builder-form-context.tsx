'use client'

import { createContext, useState } from 'react'
import { FormTargets } from '../_lib/builder-form-sidebar-items'

interface BuilderForm {
  current: FormTargets
  updateForm: (form: FormTargets) => void
}

export const BuilderFormContext = createContext<BuilderForm>({} as BuilderForm)

export default function BuilderFormProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentForm, setCurrentForm] = useState<FormTargets>('data')

  function updateForm(form: FormTargets) {
    setCurrentForm(form)
  }

  return (
    <BuilderFormContext.Provider value={{ current: currentForm, updateForm }}>
      {children}
    </BuilderFormContext.Provider>
  )
}
