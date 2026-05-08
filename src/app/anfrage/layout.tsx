import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Institutionelle Anfrage",
  description: `${brand.name}: Angebot / Research Inquiry — B2B; Warenkorb nur zur Zusammenstellung, ohne automatische Zahlung.`,
  robots: { index: true, follow: true },
};

export default function AnfrageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
