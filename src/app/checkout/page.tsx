import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { CheckoutClient } from "@/app/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Warenkorb",
  description: `${brand.name}: Warenkorb — Bestellung per Banküberweisung oder institutionelle Anfrage.`,
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1200px] page-gutter-x py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12 md:py-14">
      <CheckoutClient />
    </div>
  );
}
