'use client'
import BackButton from './BackButton'
import { usePathname } from 'next/navigation'
import { headerOptions } from '~/lib/headerOptions'

const PageHeader = () => {
  const pathname = usePathname()
  const isException = pathname === '/app' || pathname === '/app/menu' || pathname === "/app/discounts" || new RegExp("^/app/menu/[^/]+$").test(pathname)
  const findHeader = headerOptions.find((header) => header.href === pathname)
  const notifications = pathname === '/app/notifications'

  return (
    <section className={`${isException ? 'hidden' : ''} ${!findHeader ? '' : '!z-30'} ${notifications ? 'bg-[#FF680D]' : ''} fixed left-0 top-0 w-full  px-4 py-8`}>
      {headerOptions.map((option, index) => (
      <div key={index}
      className={`flex justify-between items-center`}>
        {pathname === option.href ? 
        <>
          <BackButton />
          <h1>{option.name}</h1>
          {option.icon}
        </> 
        : null}
      </div>
        
      ))}
        
    </section>
  )
}

export default PageHeader