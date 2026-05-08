import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { seoSiteTagline } from "@/lib/seo-defaults";

export const alt = `${brand.name} — ${seoSiteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(148deg, #ffffff 0%, #f5f5f7 42%, #e8f2fc 100%)",
          padding: 72,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 54,
            fontWeight: 600,
            letterSpacing: "-0.035em",
            color: "#1d1d1f",
            lineHeight: 1.05,
          }}
        >
          {brand.name}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 22,
            fontSize: 26,
            fontWeight: 400,
            color: "#3d3d41",
            maxWidth: 920,
            lineHeight: 1.38,
          }}
        >
          {seoSiteTagline}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 40,
            fontSize: 21,
            color: "#0066cc",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {brand.domainDisplay}
        </span>
        <span style={{ display: "block", marginTop: 14, fontSize: 17, color: "#6e6e73", fontWeight: 500 }}>
          {brand.city}, Deutschland · EU-Forschungsbeschaffung (RUO)
        </span>
      </div>
    ),
    { ...size },
  );
}
