"use client";

import { useEffect, useState } from "react";
import { getCookies } from "@/lib/cookies";

type cookieState = {
  status: "loading" | "unauthenticated" | "authenticated";
  data: any | null;
};

function useAuthCookie(cookieName?: string) {
  const [cookie, setCookie] = useState<cookieState>({
    status: "loading",
    data: null,
  });
  useEffect(() => {
    async function newC() {
      const cookies = await getCookies(cookieName || "codebility-auth");
      if (!cookies) {
        setCookie((prev) => ({
          ...prev,
          status: "unauthenticated",
          data: cookies,
        }));
        return null;
      }
      setCookie((prev) => ({
        ...prev,
        status: "authenticated",
        data: cookies,
      }));
    }
    newC();
  }, []);
  return cookie;
}

export default useAuthCookie;
