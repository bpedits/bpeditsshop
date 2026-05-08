"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "bavaria-peptides-ruo-dismissed-v1";

/** Research-Use-Only Hinweis — branchenüblich, einmalig schließbar */
export function RumoBanner() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      try {
        setHidden(localStorage.getItem(KEY) === "1");
      } catch {
        setHidden(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setHidden(true);
  }

  if (hidden) return null;

  return (
    <div className="border-b border-hairline bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 page-gutter-x py-2.5 text-[12px] leading-snug text-foreground sm:flex-row sm:items-center sm:justify-between sm:text-[13px]">
        <p className="text-pretty pr-2">
          <span className="font-semibold tracking-wide text-foreground">RUO · nur institutionelle Forschung.</span>{" "}
          Materialien sind ausschließlich für{" "}
          <strong className="font-medium text-foreground">Hochschulen, Institute und Unternehmen mit Labor</strong>{" "}
          zur <strong className="font-medium text-foreground">professionellen in-vitro-Forschung</strong> bestimmt —{" "}
          <strong className="font-medium text-foreground">kein</strong> Verkauf an Privatpersonen,{" "}
          <strong className="font-medium text-foreground">keine</strong> Anwendung am Menschen oder Tier,{" "}
          <strong className="font-medium text-foreground">keine</strong> kosmetische, diagnostische oder therapeutische
          Nutzung, <strong className="font-medium text-foreground">kein</strong> Verzehr. Ausnahmen für Verbraucherzwecke
          gibt es nicht.{" "}
          <Link href="/forschungsbedingungen-b2b" className="font-medium text-tint underline-offset-2 hover:underline">
            B2B-Forschungsbedingungen
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 self-start rounded-full border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-medium text-muted transition hover:bg-surface sm:self-auto sm:py-1.5 sm:text-[12px]"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}
