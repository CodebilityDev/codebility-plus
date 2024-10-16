import { ChevronLeft } from 'lucide-react'
import Link, { LinkProps } from 'next/link'
import React from 'react'
import { cn } from '@codevs/ui'

interface IBackButton {
  classname?:string
  href?: string
}

const BackButton = ({classname, href, }: IBackButton) => {
  return (
    <Link href={href ?? "/app"} className={cn(`hover:bg-gray-200`, classname)}>
      <ChevronLeft size={24}/>
    </Link>
  )
}

export default BackButton