import Link from "next/link"
import React from "react"
import Image from "next/image"

import { cn } from "@codevs/ui"
import { index_MarketingCardT } from "@/types/home"

export default function MarketingCard({ title, description, className }: index_MarketingCardT) {
  return (
    <Link className="cursor-pointer " href="/">
      <div className="p-2 text-white">
        <div
          className={cn(
            " flex w-full flex-col items-center justify-center gap-2 rounded-md border-2  border-light-900/5 px-8 py-8 backdrop-blur-lg  hover:opacity-70 md:h-60 lg:h-48",
            className
          )}
        >
          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="font-bold">{title}</h1>
            <span className="flex size-10 flex-col items-center justify-center rounded-full border-2 border-white/5 bg-white/5 hover:bg-[#9747FF] ">
              <Image src="/assets/svgs/icon-arrow-up-right.svg" width={15} height={15} alt="arrow up" unoptimized />
            </span>
          </div>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  )
}
