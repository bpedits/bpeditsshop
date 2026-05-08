"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { brand } from "@/lib/brand";
import { headerNav, mobileMenuSecondary } from "@/lib/navigation";
import { HeaderSearch } from "@/components/header-search";
import { LogoPlaceholder } from "@/components/logo-placeholder";

type NavItem = (typeof headerNav)[number];

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-[22px]" aria-hidden>
      <span
        className={`absolute left-0 top-[5px] block h-[2px] w-[22px] rounded-full bg-current transition duration-300 ease-out ${
          open ? "translate-y-[6px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 block h-[2px] w-[22px] -translate-y-1/2 rounded-full bg-current transition duration-200 ease-out ${
          open ? "scale-x-0 opacity-0" : ""
        }`}
      />
      <span
        className={`absolute bottom-[5px] left-0 block h-[2px] w-[22px] rounded-full bg-current transition duration-300 ease-out ${
          open ? "-translate-y-[6px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function SiteHeaderMobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const panelId = useId();
  const titleId = `${panelId}-title`;
  const panelWrapRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setPresent(false);
      closeTimerRef.current = null;
    }, 320);
  }, []);

  const openMenu = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    // Erst geschlossen mounten, dann im nächsten Frame öffnen -> saubere Transition.
    setPresent(true);
    setOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true));
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", onKey);
    queueMicrotask(() => backdropRef.current?.focus());

    const wrap = panelWrapRef.current;
    const getFocusables = () =>
      wrap
        ? ([
            ...(wrap.querySelectorAll<HTMLElement>(
              'a[href], button:not([tabindex="-1"])',
            ) ?? []),
          ].filter((el) => !el.hasAttribute("disabled") && !el.closest("[aria-hidden=\"true\"]")))
        : [];

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const f = getFocusables();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === backdropRef.current) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        backdropRef.current?.focus();
      }
    };
    wrap?.addEventListener("keydown", onTab);

    return () => {
      document.removeEventListener("keydown", onKey);
      wrap?.removeEventListener("keydown", onTab);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [open, close]);

  useEffect(() => {
    if (!open && openerRef.current) {
      openerRef.current.focus({ preventScroll: true });
    }
  }, [open]);

  const overlay =
    present && typeof document !== "undefined"
      ? createPortal(
      <div className="fixed inset-0 z-[100] md:hidden" aria-hidden={!open}>
        <button
          ref={backdropRef}
          type="button"
          tabIndex={open ? 0 : -1}
          className={`absolute inset-0 bg-black/[0.42] backdrop-blur-[3px] transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Menü schließen"
          onClick={close}
        />
        <div
          ref={panelWrapRef}
          id={panelId}
          role={open ? "dialog" : undefined}
          aria-modal={open ? true : undefined}
          aria-labelledby={open ? titleId : undefined}
          className={`absolute inset-y-0 right-0 flex w-[min(100vw,26rem)] flex-col border-l border-black/[0.08] bg-surface pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-[-24px_0_80px_rgba(0,0,0,0.12)] transform-gpu will-change-transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            open
              ? "translate-x-0 pointer-events-auto"
              : "translate-x-full pointer-events-none"
          }`}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 px-4 pb-4 pt-3">
            <div className="min-w-0">
              <Link
                href="/"
                className="inline-flex py-1"
                aria-label={`Zur Startseite – ${brand.name}`}
                onClick={close}
                tabIndex={open ? 0 : -1}
              >
                <LogoPlaceholder />
              </Link>
              <p id={titleId} className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Navigation
              </p>
            </div>
            <button
              type="button"
              className="inline-flex min-h-[48px] min-w-[48px] shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-foreground transition hover:bg-black/[0.08] motion-safe:active:scale-[0.96]"
              onClick={close}
              aria-label="Menü schließen"
              tabIndex={open ? 0 : -1}
            >
              <MenuIcon open />
            </button>
          </div>

          <div className="shrink-0 px-3 pb-2">
            <HeaderSearch variant="drawer" onNavigate={close} />
          </div>

          <nav
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3"
            aria-label="Hauptnavigation mobil"
          >
            <ul className="flex flex-col gap-1 border-y border-black/[0.05] bg-black/[0.02] px-2 py-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex min-h-[52px] items-center justify-between gap-4 rounded-xl px-3 py-3 text-[17px] font-medium tracking-tight text-foreground transition hover:bg-black/[0.06] motion-safe:active:scale-[0.995]"
                    onClick={close}
                    tabIndex={open ? 0 : -1}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="shrink-0 text-muted opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/checkout"
                  className="group flex min-h-[52px] items-center justify-between gap-4 rounded-xl px-3 py-3 text-[17px] font-medium tracking-tight text-foreground transition hover:bg-black/[0.06] motion-safe:active:scale-[0.995]"
                  onClick={close}
                  tabIndex={open ? 0 : -1}
                >
                  <span>Warenkorb</span>
                  <ChevronRight className="shrink-0 text-muted opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              </li>
            </ul>

            <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Mehr von {brand.name}
            </p>
            <ul className="mt-2 flex flex-col gap-0">
              {mobileMenuSecondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-12 items-center rounded-lg px-3 py-2.5 text-[14px] leading-snug text-muted transition hover:bg-black/[0.05] hover:text-foreground"
                    onClick={close}
                    tabIndex={open ? 0 : -1}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto shrink-0 border-t border-black/[0.08] px-4 py-4">
            <Link
              href="/anfrage"
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-tint text-[15px] font-semibold text-white transition hover:opacity-92 motion-safe:active:scale-[0.98]"
              onClick={close}
              tabIndex={open ? 0 : -1}
            >
              Institutionelle Anfrage
            </Link>
            <Link
              href="/kontakt"
              className="mt-3 flex min-h-11 items-center justify-center text-[14px] font-medium text-tint transition hover:opacity-85"
              onClick={close}
              tabIndex={open ? 0 : -1}
            >
              Direkt kontaktieren
            </Link>
          </div>
        </div>
      </div>,
      document.body,
    )
      : null;

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className="inline-flex min-h-[48px] min-w-[48px] shrink-0 touch-manipulation items-center justify-center rounded-full text-foreground outline-none ring-tint transition hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => {
          if (open) {
            close();
            return;
          }
          openMenu();
        }}
      >
        <span className="sr-only">{open ? "Menü schließen" : "Menü öffnen"}</span>
        <MenuIcon open={open} />
      </button>
      {overlay}
    </>
  );
}
