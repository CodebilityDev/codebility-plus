'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation';

interface MenuLinkProps {
  name: string;
  href: string;
  icon: JSX.Element
}
const MenuLink = ({name, href, icon}: MenuLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link 
      href={href}
      className={`${isActive ? 'bg-[#FF670E] text-white': ''} hover:bg-orange-400 hover:text-white flex items-center gap-4 py-4 px-[10px] rounded-lg`}
    >
      {icon}
      {name}
    </Link>
  )
}

export default MenuLink