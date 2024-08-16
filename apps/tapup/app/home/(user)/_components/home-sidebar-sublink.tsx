'use client'

import { Dot } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  href: string
  link: string
  className?: string
}
const DashboardSubLink = ({ href, link, className }: Props) => {
  const pathname = usePathname()
  const isActive = pathname === href
  function isActiveChecker() {
    return isActive ? 'text-custom-green' : ''
  }
  return (
    <Link
      href={href}
      className={
        className +
        `${isActiveChecker()} i hover:bg-custom-green/80 group mt-2 flex items-center rounded-md px-5 pl-4 text-sm hover:text-white`
      }
    >
      <Dot size={45} />
      <span className="text-white group-hover:text-white">{link}</span>
    </Link>
  )
}

export default DashboardSubLink
