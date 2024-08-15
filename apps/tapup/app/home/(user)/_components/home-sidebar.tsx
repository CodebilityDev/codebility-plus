'use client'
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SidebarLink, SIDEBAR_LINKS } from '../_lib/home-sidebar-links'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Sublink from './home-sidebar-sublink'

function HomeSidebar() {
  return (
    <aside className="bg-custom-black z-30 hidden min-h-screen w-full shadow-lg lg:block">
      <nav className="bg-custom-black flex h-dvh flex-col shadow-sm">
        <div className="mb-8 flex items-center gap-2 p-4 pb-2 text-2xl">
          <span className="font-bold text-white">Tap</span>
          <span className="text-custom-green font-bold">Up</span>
        </div>

        <ul className="flex flex-1 flex-col gap-4 px-8 text-white">
          {SIDEBAR_LINKS.map((el, i) => (
            <SidebarItems
              item={el}
              key={el.key}
              chevron={Boolean(el.subLinks && el.subLinks.length > 0)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default HomeSidebar

type SidebarItemsProps = {
  item: SidebarLink
  chevron: boolean
}

export function SidebarItems({ item, chevron }: SidebarItemsProps) {
  const pathname = usePathname()
  const isActive = () => {
    return item.path === pathname
  }
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <li
        className={`flex items-center justify-between rounded-md px-2 py-3 duration-300  ${isActive() ? 'bg-custom-green' : 'bg-custom-black hover:bg-custom-green/80'} ${item.key === 'settings' && 'mb-3 mt-auto'}`}
      >
        <Link
          href={item.path}
          className="flex  w-40 items-center gap-2 text-sm hover:text-white"
        >
          {item.icon}
          {item.label}
        </Link>
        {chevron && (
          <div onClick={() => setIsOpen(!isOpen)}>
            <ChevronDown
              className={`${isOpen ? 'rotate-180' : ''} cursor-pointer duration-300`}
            />
          </div>
        )}
      </li>

      {chevron && (
        <div
          className={`overflow-hidden transition-all duration-300   ${
            isOpen ? 'max-h-40' : 'max-h-0'
          }`}
        >
          {item.subLinks?.map((el) => (
            <Sublink href={el.path} key={el.key} link={el.label} />
          ))}
        </div>
      )}
    </>
  )
}
