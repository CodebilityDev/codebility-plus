"use client";

import React, { createContext } from "react";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  main_position: string;
  start_time: number;
  end_time: number;
  image_url: string;
  permissions: string[];
  pronoun: string;
  address: string;
  about: string;
  education: string;
  positions: string;
  portfolio_website: string;
  tech_stacks: string[];
  application_status: string;
}

export const UserContext = createContext<User>({} as User);

export default function UserContextProvider({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: User;
}) {
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}
