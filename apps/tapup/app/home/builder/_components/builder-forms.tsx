'use client'

import useBuilderForm from '../_hooks/useBuilderForm'
import BuilderFormsSidebar from './builder-forms-sidebar'
import builderFormSidebarItems, {
  SidebarItem,
} from '../_lib/builder-form-sidebar-items'

function BuilderForms() {
  const { current } = useBuilderForm()
  const form = builderFormSidebarItems.find((items) => items.target === current)
  const { Form } = form as SidebarItem
  return (
    <div className="flex-1">
      <div className="flex h-full w-full gap-x-7">
        <BuilderFormsSidebar />
        <div className="w-full">
          <div className="bg-white">
            <Form />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderForms
