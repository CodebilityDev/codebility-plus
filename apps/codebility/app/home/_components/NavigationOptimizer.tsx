"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Prefetches the routes this user can actually reach, after idle so it never
 * competes with first paint. Reads the rendered <a href="/home..."> links rather
 * than a hardcoded list, so it follows the role-filtered sidebar instead of
 * warming routes the user would be redirected away from.
 *
 * Keyed on `pathname` because the set of rendered links changes per route, for
 * example the kanban board only exists inside a project.
 */
export function NavigationOptimizer() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const prefetchVisibleLinks = () => {
      const seen = new Set<string>();
      for (const link of document.querySelectorAll<HTMLAnchorElement>(
        'a[href^="/home"]',
      )) {
        const href = link.getAttribute("href");
        if (!href || href === pathname || seen.has(href)) continue;
        seen.add(href);
        router.prefetch(href);
      }
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetchVisibleLinks, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = setTimeout(prefetchVisibleLinks, 1500);
    return () => clearTimeout(timer);
  }, [router, pathname]);

  return null;
}
