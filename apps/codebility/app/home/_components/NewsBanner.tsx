import { cookies } from "next/headers";
import { getCurrentNewsBanners } from "@/lib/server/dashboard-reference-cached";

import NewsBannerList from "./NewsBannerList";
import { DISMISSED_BANNERS_COOKIE } from "./news-banner-cookie";

export default async function NewsBanner() {
  const [banners, cookieStore] = await Promise.all([
    getCurrentNewsBanners(),
    cookies(),
  ]);

  if (banners.length === 0) return null;

  // Dismissals live in a cookie rather than localStorage so the server can
  // filter them out before paint instead of flashing a dismissed banner.
  const dismissed = new Set(
    (cookieStore.get(DISMISSED_BANNERS_COOKIE)?.value ?? "")
      .split(",")
      .filter(Boolean),
  );

  const visible = banners.filter((banner) => !dismissed.has(banner.id));

  if (visible.length === 0) return null;

  return <NewsBannerList banners={visible} />;
}
