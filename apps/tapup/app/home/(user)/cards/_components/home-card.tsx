import { PenLine } from 'lucide-react'
import React from 'react'
import Card from '~/types/cards'
import HomeActivateCardModal from './home-activate-card-modal'
import { CircleUserRound } from 'lucide-react'
import Link from 'next/link'
import pathsConfig from '~/config/paths.config'
import { Button } from '@codevs/ui/button'

interface CardProps {
  card: Card
  className?: string
  height?: string
  width?: string
}

const HomeCard = ({ card, className, height, width }: CardProps) => {
  const { id, name, industry, status, username_url } = card
  return (
    <div
      className={`flex h-[15vw] w-[24vw] flex-col justify-between rounded-[20px] bg-black p-6 text-white ${className}`}
      style={{ width: width, height: height }}
    >
      <div className="flex justify-between">
        <div className="text-xs">
          {!status && <HomeActivateCardModal cardId={id} />}
        </div>
        <div className="flex flex-1 flex-col items-end">
          <p className="text-xs font-bold">{name}</p>
          <p className="text-[10px]">{industry}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Link href={pathsConfig.app.builder + `/${id}`}>
            <CircleUserRound className="size-5" />
          </Link>
        </div>
        <div className="flex items-center justify-between gap-x-2">
          <Link
            href={username_url || '#'}
            className="text-[8px] text-[#b4b4b4]"
          >
            {status ? 'http://localhost:3000' : 'Activate to set profile URL'}
          </Link>
          <Button disabled={!status} className="h-0 p-0">
            <Link href="#" className="text-right text-[#b4b4b4]" aria-disabled>
              <PenLine size={10} fill="#b4b4b4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomeCard
