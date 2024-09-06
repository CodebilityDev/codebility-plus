"use client";

import { createContext } from "react";

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

export const UserWorkspaceContext = createContext<User>({} as User);

export function UserWorkspaceContextProvider(
  props: React.PropsWithChildren<{
    value: User;
  }>,
) {
  return (
    <UserWorkspaceContext.Provider value={props.value}>
      {props.children}
    </UserWorkspaceContext.Provider>
  );
}
