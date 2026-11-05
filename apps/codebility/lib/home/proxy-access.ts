import { headers } from "next/headers";

import {
  PROXY_ACCESS_HEADER,
  decodeProxyAccess,
} from "@/lib/global/proxy-access";
import type { ProxyAccess } from "@/types/global/permissions";

export async function readHomeAccess(): Promise<ProxyAccess | undefined> {
  const requestHeaders = await headers();
  return decodeProxyAccess(requestHeaders.get(PROXY_ACCESS_HEADER));
}
