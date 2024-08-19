'use client'

import { createContext, useState } from 'react'
import { FormTargets } from '../_lib/builder-form-sidebar-items'
import Card from '~/types/cards'

interface BuilderForm {
  current: FormTargets
  cardData: Card
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
  const [currentForm, setCurrentForm] = useState<FormTargets>('data')

  function updateForm(form: FormTargets) {
    setCurrentForm(form)
  }

  return (
    <BuilderFormContext.Provider
      value={{
        cardData,
        current: currentForm,
        updateForm,
      }}
    >
      {children}
    </BuilderFormContext.Provider>
  )
}
