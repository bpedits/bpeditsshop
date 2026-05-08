"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { allProducts } from "@/lib/product-catalog";
import { InstitutionalInquiryForm } from "@/components/institutional-inquiry-form";
import { displayPackForShop } from "@/lib/product-pack-display";
import { formatCartForInquiry, readCartLines, subscribeCart } from "@/lib/cart-storage";

function Inner() {
  const searchParams = useSearchParams();
  const skuRaw = searchParams.get("sku");
  const sku = (skuRaw ?? "").trim();
  const checkout = searchParams.get("checkout") === "1";

  const [cartPreset, setCartPreset] = useState("");
  const [cartJson, setCartJson] = useState("");

  useEffect(() => {
    if (!checkout) {
      queueMicrotask(() => {
        setCartPreset("");
        setCartJson("");
      });
      return;
    }
    function sync() {
      queueMicrotask(() => {
        const lines = readCartLines();
        setCartPreset(formatCartForInquiry(lines));
        setCartJson(JSON.stringify(lines));
      });
    }
    sync();
    return subscribeCart(sync);
  }, [checkout]);

  const presetFromSku = useMemo(() => {
    if (!sku) return { line: "", skuOut: "" };
    const q = sku.toUpperCase();
    const match = allProducts.find((p) => p.variants.some((v) => v.sku.toUpperCase() === q));
    const v = match?.variants.find((x) => x.sku.toUpperCase() === q);
    const line =
      match && v
        ? `${v.sku} — ${match.name} (${displayPackForShop(v.pack)})`
        : sku;
    return { line, skuOut: sku };
  }, [sku]);

  const presetProductLine = checkout ? cartPreset : presetFromSku.line;
  const presetSku = checkout ? "" : presetFromSku.skuOut;
  const cartSnapshotJson = checkout ? cartJson : "";

  const formKey = checkout ? `checkout-${cartJson.length}` : `sku-${sku || "none"}`;

  return (
    <InstitutionalInquiryForm
      key={formKey}
      presetSku={presetSku}
      presetProductLine={presetProductLine}
      cartSnapshotJson={cartSnapshotJson}
    />
  );
}

export function InquirySkuResolver() {
  return (
    <Suspense fallback={<p className="text-[15px] text-muted">Formular wird geladen …</p>}>
      <Inner />
    </Suspense>
  );
}
