"use client";

import React, { createContext } from "react";

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    main_position: string;
    image_url: string;
    permissions: string[];
}

export const UserContext = createContext<User>({} as User);

export default function UserContextProvider({
    children,
    userData
}: {
    children: React.ReactNode,
    userData: User
}) {

    return <UserContext.Provider value={userData}>
        {children}
    </UserContext.Provider>
}