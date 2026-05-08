"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResearchUseNotice } from "@/components/research-use-notice";

/**
 * Bei jedem Besuch des Warenkorbs (/checkout): RUO-Hinweis als zentriertes Modal.
 * Schließen über Button, Backdrop-Klick oder Escape — beim erneuten Aufruf des Warenkorbs erscheint der Dialog wieder.
 */
export function CheckoutRuoDialog() {
  const [open, setOpen] = useState(true);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const acknowledge = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") acknowledge();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, acknowledge]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] motion-safe:transition-opacity"
        aria-label="Hinweis schließen"
        onClick={acknowledge}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-ruo-dialog-title"
        className="relative z-[1] flex max-h-[min(88dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-[22px] border border-black/[0.1] bg-white shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="checkout-ruo-dialog-title" className="sr-only">
          Research Use Only — B2B-Warenkorb
        </h2>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
          <ResearchUseNotice variant="full" idSuffix="checkout-modal" />
        </div>
        <div className="shrink-0 border-t border-black/[0.08] bg-canvas-parchment/95 px-4 py-3.5 sm:px-5 sm:py-4">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={acknowledge}
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-tint px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,102,204,0.4)] transition hover:opacity-92"
          >
            Zur Kenntnis genommen — fortfahren
          </button>
          <p className="mt-2.5 text-center text-[12px] leading-relaxed text-muted">
            Vollständige Regelungen:{" "}
            <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint hover:underline">
              Forschungsbedingungen (B2B)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
