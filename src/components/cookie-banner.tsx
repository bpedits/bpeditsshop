"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  OPEN_COOKIE_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/cookie-consent";
import { ResearchUseNotice } from "@/components/research-use-notice";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const syncFromStorage = useCallback(() => {
    const c = readConsent();
    if (c) {
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
    } else {
      setAnalytics(false);
      setMarketing(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      syncFromStorage();
      setOpen(readConsent() === null);
    });
    return () => {
      alive = false;
    };
  }, [syncFromStorage]);

  useEffect(() => {
    const onOpen = () => {
      syncFromStorage();
      setExpanded(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, onOpen);
  }, [syncFromStorage]);

  const close = useCallback(() => {
    setOpen(false);
    setExpanded(false);
  }, []);

  const saveNecessaryOnly = useCallback(() => {
    writeConsent({ analytics: false, marketing: false });
    close();
  }, [close]);

  const saveAll = useCallback(() => {
    writeConsent({ analytics: true, marketing: true });
    close();
  }, [close]);

  const saveSelection = useCallback(() => {
    writeConsent({ analytics, marketing });
    close();
  }, [analytics, marketing, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-8 sm:items-center sm:p-6"
    >
      <div className="max-h-[min(92dvh,720px)] w-full max-w-2xl overflow-y-auto rounded-[20px] border border-black/[0.08] bg-white p-4 shadow-[0_12px_48px_rgba(0,0,0,0.18)] sm:p-6">
        <h2 id="cookie-title" className="text-[17px] font-semibold tracking-tight text-foreground sm:text-[18px]">
          Einwilligung, Speicherung &amp; Forschungsrahmen
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Diese Website ist auf{" "}
          <strong className="font-medium text-foreground">institutionelle Forschung</strong> (Labor,
          Hochschule, reguliertes Unternehmenslabor) ausgelegt — nicht auf Verbraucher- oder
          Lifestyle-Käufe. Technisch setzen wir{" "}
          <strong className="font-medium text-foreground">keine</strong> Statistik- oder Marketing-Tools
          auf Ihrem Endgerät, bis Sie unten zustimmen. Notwendige Funktionen (Sicherheit, Warenkorb)
          bleiben unabhängig davon erforderlich.
        </p>

        <details className="mt-4 rounded-xl border border-black/[0.07] bg-surface-pearl/40 px-3 py-2 sm:px-4 sm:py-3">
          <summary className="cursor-pointer text-[13px] font-semibold text-foreground">
            Forschung, Bestellberechtigung &amp; unzulässige Verwendung — vollständig lesen
          </summary>
          <div className="mt-3 border-t border-black/[0.06] pt-3">
            <ResearchUseNotice variant="full" idSuffix="cookie-dialog" />
          </div>
        </details>

        <p className="mt-4 text-[12px] leading-relaxed text-muted">
          <strong className="font-medium text-foreground">Datenschutz &amp; Cookies:</strong>{" "}
          <Link href="/datenschutz" className="font-medium text-tint hover:underline">
            Datenschutz
          </Link>
          {" · "}
          <Link href="/cookies" className="font-medium text-tint hover:underline">
            Cookies &amp; Speicherung
          </Link>
          .
        </p>

        {expanded ? (
          <div className="mt-5 space-y-4 rounded-xl border border-black/[0.06] bg-canvas-parchment/50 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Optionale Kategorien</p>

            <label className="flex cursor-pointer gap-3 rounded-lg border border-black/[0.06] bg-white px-3 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tint/30">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-black/25 text-tint focus:ring-tint/25"
              />
              <span>
                <span className="text-[14px] font-medium text-foreground">Statistik</span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                  Reichweite und Nutzung (z. B. anonymisierte oder pseudonyme Auswertung). Ohne
                  Einwilligung nicht aktiv.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer gap-3 rounded-lg border border-black/[0.06] bg-white px-3 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tint/30">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-black/25 text-tint focus:ring-tint/25"
              />
              <span>
                <span className="text-[14px] font-medium text-foreground">Marketing</span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">
                  z. B. Remarketing, personalisierte Anzeigen — nur nach ausdrücklicher Zustimmung.
                </span>
              </span>
            </label>

            <p className="text-[11px] leading-relaxed text-muted">
              <strong className="font-medium text-foreground">Notwendig</strong> (Session, Sicherheit,
              Warenkorb-Zusammenstellung im Browser) ist für den Betrieb erforderlich und kann nicht
              abgewählt werden — siehe Speicherhinweis unter /cookies.
            </p>
            <button
              type="button"
              onClick={() => {
                setAnalytics(true);
                setMarketing(true);
              }}
              className="text-[12px] font-medium text-tint hover:underline"
            >
              Alle optionalen Kategorien anhaken
            </button>
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <button
            type="button"
            onClick={saveNecessaryOnly}
            className="inline-flex min-h-12 flex-1 touch-manipulation items-center justify-center rounded-full border-2 border-black/[0.12] bg-white px-5 text-[14px] font-medium text-foreground transition hover:bg-black/[0.03] sm:min-h-11 sm:flex-initial"
          >
            Nur notwendig
          </button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex min-h-12 flex-1 touch-manipulation items-center justify-center rounded-full border border-black/[0.1] bg-fill-secondary px-5 text-[14px] font-medium text-foreground transition hover:bg-fill-secondary-pressed sm:min-h-11 sm:flex-initial"
          >
            {expanded ? "Einklappen" : "Auswahl"}
          </button>
          {expanded ? (
            <button
              type="button"
              onClick={saveSelection}
              className="inline-flex min-h-12 flex-1 touch-manipulation items-center justify-center rounded-full bg-tint px-5 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,102,204,0.4)] transition hover:opacity-95 sm:min-h-11 sm:flex-initial"
            >
              Auswahl speichern
            </button>
          ) : (
            <button
              type="button"
              onClick={saveAll}
              className="inline-flex min-h-12 flex-1 touch-manipulation items-center justify-center rounded-full bg-tint px-5 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,102,204,0.4)] transition hover:opacity-95 sm:min-h-11 sm:flex-initial"
            >
              Alle akzeptieren
            </button>
          )}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          Speicher-Schlüssel: <code className="rounded bg-black/[0.05] px-1 font-mono text-[10px]">{CONSENT_STORAGE_KEY}</code>
          . Widerruf: Einstellungen erneut öffnen und abwählen oder Eintrag im Browser löschen.
        </p>
      </div>
    </div>
  );
}
