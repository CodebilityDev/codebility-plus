import React from 'react'
import Navbar from './_components/home-navbar'
import Sidebar from './_components/home-sidebar'

async function UserHomePage() {
  return (
    <div className="flex">
      <div className="h-screen w-1/5">
        <Sidebar />
      </div>

      <div className="flex-1 bg-slate-100">
        <Navbar />
      </div>
    </div>
  )
}

export default UserHomePage
