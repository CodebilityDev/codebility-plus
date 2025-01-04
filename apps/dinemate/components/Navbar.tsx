"use client"

import { HandHelping, Home, Share2 } from 'lucide-react'
import NavLink from './NavLink'
import { PiShoppingCart } from 'react-icons/pi'
import { usePathname } from 'next/navigation'

const navlist = [
  {
    name: "Home",
    href: "/app",
    icon: <Home size={24}/>
  },
  {
    name: 'Cart',
    href: '/app/cart',
    icon: <PiShoppingCart size={24}/>
  },
  {
    name: 'Assist',
    href: '/app/assist',
    icon: <HandHelping size={24}/>
  },
  {
    name: 'Share QR',
    href: '/app/share',
    icon: <Share2 size={24}/>
  }
]
const Navbar = () => {
  const pathname = usePathname()

  const findNav = navlist.find((nav) => nav.href === pathname)

  if(!findNav || findNav.href === 'app/assist') return null

  return (
    <footer className='z-20'>
      <div className='flex justify-between gap-5 w-full px-3'>
        {navlist.map((item) => (
          <NavLink key={item.name} name={item.name} href={item.href} icon={item.icon}/>
        ))}
      </div>
    </footer>
  )
}

export default Navbar