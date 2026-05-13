import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryConfirmation } from "@/components/inquiry-confirmation";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/anfrage-gesendet",
  title: "Anfrage eingegangen",
  description: "Bestätigung: institutionelle Anfrage eingegangen — nächste Schritte und Kontakt.",
  keywords: ["Anfrage bestätigt", "Institutionelle Anfrage"],
  robots: { index: false, follow: true },
});

function ConfirmationFallback() {
  return (
    <div className="mx-auto max-w-lg rounded-[22px] border border-black/[0.06] bg-white px-8 py-16 shadow-sm">
      <div className="mx-auto mb-6 h-14 w-14 animate-pulse rounded-full bg-black/[0.06]" aria-hidden />
      <div className="mx-auto h-8 max-w-[14rem] animate-pulse rounded-lg bg-black/[0.06]" />
      <div className="mx-auto mt-4 h-4 max-w-xl animate-pulse rounded bg-black/[0.05]" />
      <div className="mx-auto mt-3 h-4 max-w-md animate-pulse rounded bg-black/[0.05]" />
    </div>
  );
}

export default function InquirySentPage() {
  return (
    <div className="border-b border-black/[0.05] bg-gradient-to-b from-surface via-canvas-parchment/45 to-canvas-parchment">
      <div className="mx-auto max-w-lg page-gutter-x py-12 sm:py-16 md:py-20">
        <Suspense fallback={<ConfirmationFallback />}>
          <InquiryConfirmation />
        </Suspense>
      </div>
    </div>
  );
}
