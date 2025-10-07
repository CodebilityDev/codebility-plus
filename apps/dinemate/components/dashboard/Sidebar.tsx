

import SidebarMenu from './SidebarMenu'
import AdminButton from './AdminButton'
import LogoutButton from './LogoutButton'
import CodeGenerator from './CodeGenerator'
import Image from 'next/image'

const Sidebar = () => {
  return (
    <section className='flex flex-col h-full fixed bottom-0 px-8 pt-8 pb-5 '>
      <div className="flex items-center">
        <Image src={"/logo.png"} width={56} height={56} alt="logo"/>
        <h3 className='font-bold text-[#FF670E] ps-[10px]'>DINEMATE</h3>

      </div>
      
        <SidebarMenu/>
      
      <div className="flex flex-col gap-2">
        <CodeGenerator />
        <AdminButton/>
        <LogoutButton/>
      </div>
    </section>
  )
}

export default Sidebar