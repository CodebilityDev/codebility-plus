'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  name: string
  href: string
  icon: JSX.Element
}
const NavLink = ({name, href, icon}: NavLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link 
      href={href} 
      className={`text-[10px] flex flex-col items-center  ${isActive ? 'text-[#FF8236] hover:text-[#FF8236]' : 'text-[#6B788E]'}`}
    >
      {icon}
      {name}
    </Link>
  )
}

export default NavLink