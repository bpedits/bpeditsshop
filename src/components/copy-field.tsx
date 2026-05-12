"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Variant = "default" | "prominent";

type Props = {
  /** Sichtbarer Wert (Anzeige). */
  display: string;
  /** Tatsächlich kopierter Wert (z. B. IBAN ohne Leerzeichen). Default: display. */
  copyValue?: string;
  /** Label/Bezeichnung links vom Wert. */
  label?: string;
  /** Monospace für den Wert (IBAN/BIC/Bestellnummer). */
  mono?: boolean;
  /** „prominent" rendert größer + dezent farbig (für die Bestellnummer). */
  variant?: Variant;
  /** Aria-Label für den Kopier-Button. */
  ariaLabel?: string;
};

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback unten */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CopyField({
  display,
  copyValue,
  label,
  mono = false,
  variant = "default",
  ariaLabel,
}: Props) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const handle = useCallback(async () => {
    const ok = await writeClipboard(copyValue ?? display);
    setState(ok ? "ok" : "fail");
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1600);
  }, [copyValue, display]);

  const prominent = variant === "prominent";

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={ariaLabel ?? `${label ? `${label} — ` : ""}${display} kopieren`}
      className={[
        "group flex w-full touch-manipulation items-center gap-3 rounded-lg border text-left transition",
        prominent
          ? "border-tint/15 bg-tint/[0.04] px-3 py-3 sm:px-4 sm:py-3.5 hover:bg-tint/[0.07]"
          : "border-black/[0.08] bg-white px-3 py-2.5 hover:bg-black/[0.02]",
      ].join(" ")}
    >
      <span className="min-w-0 flex-1">
        {label ? (
          <span
            className={[
              "block text-[11px] font-semibold uppercase tracking-[0.1em]",
              prominent ? "text-tint" : "text-muted",
            ].join(" ")}
          >
            {label}
          </span>
        ) : null}
        <span
          className={[
            "block overflow-x-auto",
            mono ? "font-mono tabular-nums" : "",
            prominent
              ? "mt-0.5 whitespace-nowrap text-[15px] font-semibold tracking-tight text-foreground sm:text-[18px]"
              : "mt-0.5 text-[13px] text-foreground sm:text-[14px]",
            mono && !prominent ? "whitespace-nowrap" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ scrollbarWidth: "none" }}
        >
          {display}
        </span>
      </span>
      <span
        className={[
          "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition-colors",
          state === "ok"
            ? "bg-[#0a7d3a]/10 text-[#0a7d3a]"
            : state === "fail"
              ? "bg-[#b00020]/10 text-[#b00020]"
              : "bg-black/[0.06] text-foreground group-hover:bg-black/[0.1]",
        ].join(" ")}
        aria-hidden="true"
      >
        {state === "ok" ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Kopiert
          </>
        ) : state === "fail" ? (
          "Fehler"
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Kopieren
          </>
        )}
      </span>
    </button>
  );
}
