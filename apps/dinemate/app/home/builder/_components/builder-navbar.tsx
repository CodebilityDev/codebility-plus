'use client'

import Link from 'next/link'
import pathsConfig from '~/config/paths.config'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@codevs/ui/button'
import appConfig from '~/config/app.config'
import useCard from '../_hooks/useCard'
import HomeActivateCardModal from '../../_components/home-activate-card-modal'
import HomePublishProfileModal from './home-publish-profile-modal'

function BuilderNavbar() {
  const { cardData } = useCard()

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
        {cardData.status ? (
          <div className="flex items-center gap-x-2">
            <Link
              href={cardData.username_url || '#'}
              target={cardData.username_url ? '_blank' : '_self'}
              className="font-bold underline"
            >
              {cardData.username_url || 'set a profile url'}
            </Link>
            <HomePublishProfileModal />
          </div>
        ) : (
          <HomeActivateCardModal cardId={cardData.id}>
            <Button>Publish Profile</Button>
          </HomeActivateCardModal>
        )}
      </div>
    </div>
  )
}

export default BuilderNavbar
