import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";
import { seoSiteTagline } from "@/lib/seo-defaults";

/** Node: zuverlässiges Einlesen von `public/favicon.png` (ohne HTTP-Fetch). */
export const runtime = "nodejs";

export const alt = `${brand.name} — ${seoSiteTagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function logoDataUrl(): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "favicon.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const logo = await logoDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          background: "linear-gradient(165deg, #fafbfc 0%, #eef2f7 38%, #dce9f7 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        }}
      >
        {/* Marken-Akzentleiste */}
        <div
          style={{
            width: 14,
            height: "100%",
            background: "linear-gradient(180deg, #0066cc 0%, #004999 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "56px 64px 48px 56px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 28 }}>
            {logo ? (
              <img
                src={logo}
                alt=""
                width={112}
                height={112}
                style={{
                  borderRadius: 22,
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 12px 40px rgba(0,102,204,0.12)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 22,
                  background: "linear-gradient(145deg, #0066cc, #004999)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 38,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                BP
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#0066cc",
                }}
              >
                Research use only · B2B
              </span>
              <span
                style={{
                  marginTop: 10,
                  fontSize: 56,
                  fontWeight: 600,
                  letterSpacing: "-0.038em",
                  color: "#0d0d0f",
                  lineHeight: 1.02,
                }}
              >
                {brand.name}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
            <div
              style={{
                height: 1,
                width: "100%",
                background: "linear-gradient(90deg, rgba(0,102,204,0.35), rgba(0,0,0,0.06) 55%, transparent)",
                marginBottom: 28,
              }}
            />
            <span
              style={{
                fontSize: 27,
                fontWeight: 400,
                color: "#3a3a40",
                maxWidth: 980,
                lineHeight: 1.42,
              }}
            >
              {seoSiteTagline}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 36,
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 600, color: "#0066cc", letterSpacing: "-0.02em" }}>
              {brand.domainDisplay}
            </span>
            <span style={{ fontSize: 18, color: "#6e6e73", fontWeight: 500 }}>
              {brand.city}, Deutschland · EU
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
