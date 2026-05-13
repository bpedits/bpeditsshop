import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { seoSiteTagline } from "@/lib/seo-defaults";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.name,
    description: seoSiteTagline,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfa",
    theme_color: "#0066cc",
    lang: "de",
    dir: "ltr",
    categories: ["business", "science", "shopping"],
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
