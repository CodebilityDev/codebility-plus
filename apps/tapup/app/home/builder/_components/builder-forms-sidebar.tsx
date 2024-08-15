import React from 'react'
import SidebarItems from '../_lib/builder-form-sidebar-items'
import { Button } from '@codevs/ui/button'

function BuilderFormsSidebar() {
  return (
    <div className="flex flex-col gap-y-4">
      {SidebarItems.map((items) => {
        return (
          <Button
            key={items.target}
            className="hover:bg-custom-green bg-white text-gray-400 hover:text-white"
          >
            <items.Icon />
          </Button>
        )
      })}
    </div>
  )
}

export default BuilderFormsSidebar
