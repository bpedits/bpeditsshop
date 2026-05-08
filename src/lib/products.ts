import type { Product, ProductVariant } from "@/lib/product-types";
import { allProducts as defaultLocalProducts } from "@/lib/product-catalog";

export type { Product, ProductVariant } from "@/lib/product-types";

let cachedProducts: Product[] | null = null;

/** Produktliste aus dem lokalen Katalog (`product-catalog`). */
export async function getProducts(): Promise<Product[]> {
  if (!cachedProducts) {
    cachedProducts = defaultLocalProducts;
  }
  return cachedProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductBySku(sku: string): Promise<Product | undefined> {
  const q = sku.trim().toUpperCase();
  const products = await getProducts();
  return products.find((p) => p.variants.some((v) => v.sku.toUpperCase() === q));
}

export function getVariantBySku(product: Product, sku: string): ProductVariant | undefined {
  const q = sku.trim().toUpperCase();
  return product.variants.find((v) => v.sku.toUpperCase() === q);
}
