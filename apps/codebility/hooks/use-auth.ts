"use client";

import { useEffect, useState } from "react";
import { getUserDataById } from "@/app/api";
import useAuthCookie from "@/hooks/use-cookie";

const useAuth = () => {
  // const auth = useAuthCookie()
  const [userData, setUserData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  /*  useEffect(() => {
    async function getUserData() {
      setIsLoading(true)
      const user: any = await getUserDataById(auth.data.id)
      setUserData(user.data)
      setIsLoading(false)
    }
    if (auth.status === "authenticated" && !userData) {
      getUserData()
    }
  }, [auth.status, userData])
 */
  return { isLoading, userData };
};

export default useAuth;
