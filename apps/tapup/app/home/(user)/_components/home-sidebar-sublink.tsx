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
    return isActive ? 'text-primary' : ''
  }
  return (
    <Link
      href={href}
      className={
        className +
        `${isActiveChecker()} i hover:bg-primary hover:text-primary-foreground group mt-2 flex items-center rounded-md px-5 pl-4 text-sm`
      }
    >
      <Dot size={45} />
      <span className="text-primary group-hover:text-primary-foreground">
        {link}
      </span>
    </Link>
  )
}

export default DashboardSubLink
