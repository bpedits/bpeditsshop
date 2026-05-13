import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { siteOrigin } from "@/lib/site-origin";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/checkout/", "/api/", "/anfrage-gesendet", "/admin", "/admin/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: new URL(origin).host,
  };
}
