"use client";

import { useContext } from "react";

import { UserContext } from "../_components/UserProvider";

export default function useUser() {
  const user = useContext(UserContext);

  if (!user) {
    const error = new Error("useUser hook is being used outside user context.");
    console.error("useUser Error:", error.stack);
    throw error;
  }

  return user;
}
