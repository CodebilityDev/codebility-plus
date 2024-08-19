'use client'

import SidebarItems from '../_lib/builder-form-sidebar-items'
import { Button } from '@codevs/ui/button'
import useBuilderForm from '../_hooks/useBuilderForm'
import { cn } from '@codevs/ui'

function BuilderFormsSidebar() {
  const { current, updateForm } = useBuilderForm()
  return (
    <div className="flex flex-col gap-y-4">
      {SidebarItems.map((items) => {
        const { target } = items
        return (
          <Button
            onClick={() => updateForm(target)}
            key={target}
            className={cn(
              'hover:bg-primary hover:text-background',
              current === target
                ? 'bg-primary text-background'
                : 'text-foreground/30 bg-background',
            )}
          >
            <items.Icon />
          </Button>
        )
      })}
    </div>
  )
}

export default BuilderFormsSidebar
