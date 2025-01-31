"use client";

import React, { createContext, useContext } from "react";
import { Codev as User } from "@/types/home/codev";

export const UserContext = createContext<User | null>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}

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
