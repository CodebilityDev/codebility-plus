"use client";

import { useContext } from "react";
import { UserContext } from "../_components/user-provider";

export default function useUser() {
    const user = useContext(UserContext);

    if (!user) throw new Error("useUser hook is being used outside user context.");

    return user;
}