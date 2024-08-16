import Link from 'next/link'
import pathsConfig from '~/config/paths.config'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@codevs/ui/button'
import appConfig from '~/config/app.config'

function BuilderNavbar() {
  return (
    <div className="flex justify-between">
      <div>
        <Link
          href={pathsConfig.app.cards}
          className="flex items-center gap-x-5"
        >
          <ChevronLeft className="size-8" />
          <h2 className="">{appConfig.name} Business Card</h2>
        </Link>
      </div>
      <div>
        <Button>Publish Profile</Button>
      </div>
    </div>
  )
}

export default BuilderNavbar
