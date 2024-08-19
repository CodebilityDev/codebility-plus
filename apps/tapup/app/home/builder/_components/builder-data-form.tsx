import React, { useState } from 'react'
import { UserRound, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@codevs/ui/button'
import { ProfileDataForm } from './builder_data_forms'

interface BuilderDataForm {
  target: string
  name: string
  Icon: React.ElementType
  Form: React.ElementType
}

const forms: BuilderDataForm[] = [
  {
    target: 'profile',
    name: 'Manage Profile',
    Icon: UserRound,
    Form: ProfileDataForm,
  },
  {
    target: 'social',
    name: 'Manage Socials',
    Icon: UserRound,
    Form: ProfileDataForm,
  },
  {
    target: 'services',
    name: 'Manage Services',
    Icon: UserRound,
    Form: ProfileDataForm,
  },
  {
    target: 'project',
    name: 'Manage Projects',
    Icon: UserRound,
    Form: ProfileDataForm,
  },
  {
    target: 'product',
    name: 'Manage Products',
    Icon: UserRound,
    Form: ProfileDataForm,
  },
]

function BuilderDataForm() {
  const [currentForm, setCurrentForm] = useState<string | null>(null)

  const targetForm =
    currentForm && forms.find((form) => form.target === currentForm)

  return (
    <div className="flex flex-col gap-y-2">
      <div>
        {!targetForm ? (
          forms.map((form) => {
            const { Icon } = form
            return (
              <Button
                key={form.target}
                onClick={() => setCurrentForm(form.target)}
                className="text-foreground hover:bg-foreground/10 flex w-full justify-between bg-transparent py-7"
              >
                <div className="flex items-center gap-x-2">
                  <Icon />
                  <h5 className="">{form.name}</h5>
                </div>
                <div>
                  <ChevronRight className="size-4 font-bold" />
                </div>
              </Button>
            )
          })
        ) : (
          <div>
            <div className="bg-foreground/10 px-4 py-2">
              <Button
                className="text-foreground hover:text-primary flex gap-x-3 bg-transparent p-0 hover:bg-transparent"
                onClick={() => setCurrentForm(null)}
              >
                <ChevronLeft />
                <h5 className="text-lg font-bold">
                  {targetForm && targetForm.name}
                </h5>
              </Button>
            </div>
            <div className="bg-white">
              <targetForm.Form />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuilderDataForm
