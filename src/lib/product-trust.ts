import type { Product } from "@/lib/product-types";

/** Kurze, technisch-neutrale Kennzeichnung — keine Verbraucher- oder Wellness-Sprache */
export function getProductTrustLine(product: Product): string | null {
  void product;
  return "RUO · In vitro / Labor";
}
