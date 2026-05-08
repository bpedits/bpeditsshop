import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-lg page-gutter-x py-16 text-center sm:py-24">
      <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Produkt nicht gefunden</h1>
      <p className="mt-2 text-[15px] text-muted">Dieser Artikel ist nicht im Katalog.</p>
      <Link
        href="/shop"
        className="mt-10 inline-block text-[15px] font-medium text-tint hover:underline"
      >
        Zum Shop
      </Link>
    </div>
  );
}
