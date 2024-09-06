"use client";

import React, { useContext } from "react";

import { UserWorkspaceContext } from "../../_components/user-workspace-context";
import NavbarMenu from "./home-navbar-menu";

function HomeNavbar() {
  const user = useContext(UserWorkspaceContext);

  return (
    <div className="flex justify-between bg-background">
      <div></div>
      <div className="flex items-center gap-x-2 px-6 py-3 text-foreground">
        <div>Hi, {user.full_name}</div>
        <div>
          <NavbarMenu />
        </div>
      </div>
    </div>
  );
}

export default HomeNavbar;
