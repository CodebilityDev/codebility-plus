'use client'

import React, { useContext } from 'react'
import NavbarMenu from './home-navbar-menu'
import { UserWorkspaceContext } from '../../_components/user-workspace-context'

function HomeNavbar() {
  const user = useContext(UserWorkspaceContext)

  return (
    <div className="bg-background flex justify-between">
      <div></div>
      <div className="text-foreground flex items-center gap-x-2 px-6 py-3">
        <div>Hi, {user.full_name}</div>
        <div>
          <NavbarMenu />
        </div>
      </div>
    </div>
  )
}

export default HomeNavbar
