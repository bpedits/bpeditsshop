import type { Product } from "@/lib/product-types";
import {
  PRODUCT_CATALOG_IMAGE_HEIGHT,
  getProductCatalogImageSrc,
  PRODUCT_CATALOG_IMAGE_WIDTH,
} from "@/lib/product-catalog-image";

type Props = {
  product: Pick<Product, "name" | "slug" | "category">;
  className?: string;
  /** PDP-Hero: schnelleres Laden für LCP */
  variant?: "card" | "hero";
};

/**
 * Gemeinsames Produktmotiv für Karte und PDP — `PRODUCT_CATALOG_IMAGE_SRC`.
 * Darüber optional `ProductImageDoseStrip` (PDP); unten leichter Verlauf für Lesbarkeit.
 */
export function ProductPlaceholder({ product, className = "", variant = "card" }: Props) {
  const isHero = variant === "hero";
  const src = getProductCatalogImageSrc(product.slug);

  return (
    <div
      role="img"
      aria-label={product.name}
      className={`relative aspect-square w-full overflow-hidden bg-surface-pearl ${className}`}
    >
      <img
        src={src}
        alt=""
        width={PRODUCT_CATALOG_IMAGE_WIDTH}
        height={PRODUCT_CATALOG_IMAGE_HEIGHT}
        decoding="async"
        loading={isHero ? "eager" : "lazy"}
        fetchPriority={isHero ? "high" : "low"}
        sizes={isHero ? "(min-width: 1024px) 50vw, 100vw" : "(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 25vw"}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Dezente Einbettung in die Seite + Lesbarkeit für Dosis-/Preis-Leiste unten */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.35] via-transparent to-black/[0.06]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.06]"
        aria-hidden
      />
    </div>
  );
}
