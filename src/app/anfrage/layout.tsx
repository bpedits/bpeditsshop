import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { buildPublicPageMetadata } from "@/lib/seo-page-meta";

export const metadata: Metadata = buildPublicPageMetadata({
  path: "/anfrage",
  title: "Institutionelle Anfrage",
  description: `${brand.name}: Institutionelle Anfrage / Research Inquiry — B2B, Warenkorb zur Zusammenstellung, keine automatische Zahlung; Freigaben und Konditionen nach Prüfung.`,
  keywords: ["Anfrage", "Research Inquiry", "B2B Angebot", "institutionelle Bestellung"],
  category: "business",
});

export default function AnfrageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
