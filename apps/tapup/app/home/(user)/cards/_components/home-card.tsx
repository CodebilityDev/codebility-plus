import { PenLine } from 'lucide-react'
import React from 'react'
import Card from '~/types/cards'
import HomeActivateCardModal from './home-activate-card-modal'

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
      className={`flex h-[15vw] w-[24vw] flex-col rounded-[20px] bg-black px-6 pb-6 pt-8 text-white ${className}`}
      style={{ width: width, height: height }}
    >
      <div className="flex  justify-between">
        <div className="text-xs">
          <HomeActivateCardModal cardId={id} />
        </div>
        <div className="flex flex-1 flex-col items-end">
          <p className="text-xs font-bold">{name}</p>
          <p className="text-[10px]">{industry}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <a href={username_url} className="text-[8px] text-[#b4b4b4]">
          {username_url}
        </a>
        <a href="#" className="text-right text-[#b4b4b4]">
          <PenLine size={10} fill="#b4b4b4" />
        </a>
      </div>
    </div>
  )
}

export default HomeCard
