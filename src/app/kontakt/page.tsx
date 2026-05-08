import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { brand, brandPhoneHref } from "@/lib/brand";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontakt zu ${brand.name}: Adresse, E-Mail und sicheres Nachrichtenformular — institutionelle Anliegen (B2B / RUO).`,
};

function IconMap() {
  return (
    <svg className="size-5 shrink-0 text-tint" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2.25" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className="size-5 shrink-0 text-tint" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 4h3l1.5 4.5L9 10c1.2 2.2 2.8 3.8 5 5l1.5-2 4.5 1.5V20c0 .8-.6 1.5-1.4 1.5C8.2 21.5 2.5 15.8 2.5 6.9 2.5 6.1 3.2 5.5 4 5.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg className="size-5 shrink-0 text-tint" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className="size-5 shrink-0 text-tint" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M12 3c2.5 3.2 2.5 14.8 0 18M12 3c-2.5 3.2-2.5 14.8 0 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChannelRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-black/[0.05] bg-black/[0.02] px-3 py-3 sm:px-4">
      <div className="mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
        <div className="mt-1 text-[14px] leading-snug text-foreground sm:text-[15px]">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const phoneHref = brandPhoneHref();

  return (
    <div className="border-b border-black/[0.05] bg-gradient-to-b from-surface via-canvas-parchment/40 to-canvas-parchment">
      <div className="mx-auto max-w-[1100px] page-gutter-x pb-16 pt-10 sm:pb-20 sm:pt-14 md:pb-24 md:pt-16">
        <header className="max-w-2xl motion-safe:animate-[bp-fade-up_0.55s_ease-out_both] motion-reduce:animate-none">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-tint">Kontakt · B2B / Forschung</p>
          <h1 className="mt-2 text-[clamp(1.75rem,4.2vw,2.65rem)] font-semibold leading-[1.08] tracking-tight text-foreground">
            Wir freuen uns auf Ihre Nachricht
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-muted sm:text-[17px]">
            Für <strong className="font-medium text-foreground">Institute, Labore und Einkauf</strong> — schnelle
            Orientierung, vertrauliche Abstimmung und klare nächste Schritte. Technische oder vertragliche Details
            klären wir mit den passenden Ansprechpartnern.
          </p>
        </header>

        <div className="relative isolate mt-10 overflow-hidden rounded-[22px] border border-black/[0.06] bg-gradient-to-br from-tint/[0.08] via-white to-surface-pearl/60 p-5 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.1)] sm:mt-12 sm:p-7 md:p-8">
          <div className="pointer-events-none absolute -right-24 -top-20 size-[240px] rounded-full bg-tint/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 size-[200px] rounded-full bg-white/80 blur-2xl" />
          <div className="relative flex flex-wrap gap-2">
            {["Antwort in der Regel werktags", "Verschlüsselte E-Mail möglich", "NDA auf Anfrage"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-black/[0.08] bg-white/90 px-3 py-1.5 text-[12px] font-medium text-foreground shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-2xl border border-black/[0.07] bg-white px-5 py-5 shadow-[0_4px_28px_-18px_rgba(0,0,0,0.1)] sm:px-6 sm:py-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Anschrift</h2>
              <div className="mt-4 flex gap-3">
                <IconMap />
                <address className="not-italic text-[15px] leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">{brand.legalName}</span>
                  <br />
                  {brand.addressLine1}
                  <br />
                  {brand.zip} {brand.city}
                  <br />
                  {brand.country}
                </address>
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.07] bg-white px-5 py-5 shadow-[0_4px_28px_-18px_rgba(0,0,0,0.1)] sm:px-6 sm:py-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Direkt erreichen</h2>
              <div className="mt-4 space-y-2.5">
                {phoneHref ? (
                  <ChannelRow icon={<IconPhone />} label="Telefon">
                    <a href={phoneHref} className="font-medium text-tint hover:underline">
                      {brand.phoneDisplay.trim()}
                    </a>
                  </ChannelRow>
                ) : null}
                <ChannelRow icon={<IconMail />} label="E-Mail">
                  <a href={`mailto:${brand.email}`} className="break-all font-medium text-tint hover:underline">
                    {brand.email}
                  </a>
                </ChannelRow>
                <ChannelRow icon={<IconGlobe />} label="Web">
                  <a href={brand.origin} className="font-medium text-tint hover:underline">
                    {brand.domainDisplay}
                  </a>
                </ChannelRow>
              </div>
            </div>

            <div className="rounded-2xl border border-tint/18 bg-gradient-to-br from-tint/[0.06] to-white px-5 py-5 sm:px-6 sm:py-6">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-tint">CAS-Nummern &amp; Stammdaten</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-muted sm:text-[14px]">
                CAS-Registry-Nummern sind <strong className="font-medium text-foreground">weltweit einheitlich</strong>{" "}
                (Chemical Abstracts Service). Typische Quellen: Lieferanten-Spezifikation, CoA, interne Regulatory-Docs
                oder lizenzierte Datenbanken. Im Katalog zeigen wir Referenzwerte —{" "}
                <strong className="font-medium text-foreground">maßgeblich bleibt die Charge</strong> mit CoA.
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                Wenn Sie mit uns die Datenlage zu einer SKU abstimmen möchten, nennen Sie bitte im Betreff die{" "}
                <span className="font-medium text-foreground">SKU</span> oder den{" "}
                <span className="font-medium text-foreground">Produktnamen</span>.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 text-[13px] font-medium">
              <Link
                href="/anfrage"
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-tint px-4 text-[13px] font-semibold text-white shadow-[0_6px_20px_-8px_rgba(0,102,204,0.45)] transition hover:opacity-92"
              >
                Institutionelle Anfrage
              </Link>
              <Link
                href="/hilfe"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-black/[0.1] bg-white px-4 text-[13px] text-foreground transition hover:bg-black/[0.03]"
              >
                Hilfe &amp; FAQ
              </Link>
              <Link
                href="/sicherheit-vertraulichkeit"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-black/[0.1] bg-white px-4 text-[13px] text-foreground transition hover:bg-black/[0.03]"
              >
                Sicherheit
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
