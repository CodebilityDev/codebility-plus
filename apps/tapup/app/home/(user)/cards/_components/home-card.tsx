import { PenLine } from 'lucide-react'
import React from 'react'

interface cardData {
  id: string
  name: string
  role: string
  link: string
}

interface CardProps {
  cardData: cardData
  className?: string
  height?: string
  width?: string
}

const HomeCard = ({ cardData, className, height, width }: CardProps) => {
  const { id, name, role, link } = cardData
  return (
    <div
      className={`flex h-[222px] w-[300px] flex-col rounded-[20px] bg-black px-6 pb-6 pt-8 text-white ${className}`}
      style={{ width: width, height: height }}
    >
      <div className="flex flex-1 flex-col items-end">
        <p className="text-xs font-bold">{name}</p>
        <p className="text-[10px]">{role}</p>
      </div>
      <div className="flex items-center justify-between">
        <a href={link} className="text-[8px] text-[#b4b4b4]">
          {link}
        </a>
        <a href="#" className="text-right text-[#b4b4b4]">
          <PenLine size={10} fill="#b4b4b4" />
        </a>
      </div>
    </div>
  )
}

export default HomeCard
